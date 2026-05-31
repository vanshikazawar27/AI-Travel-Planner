const normalizeCandidate = (s) =>
  (s ?? "")
    .toString()
    .replace(/\s+/g, " ")
    .replace(/[\u2013\u2014]/g, "-")
    .trim();

const cleanPlaceName = (s) =>
  normalizeCandidate(s)
    // strip common prefixes
    .replace(/^(visit|place|places|to|around|near|food|restaurant|hotel|stay|lunch|dinner|breakfast|morning|afternoon|evening)\s*[:\-]?\s*/i, "")
    // strip trailing timing
    .replace(/\s*(at|around)\s*\d{1,2}(:\d{2})?\s*(am|pm)?\s*$/i, "")
    // strip bullets
    .replace(/^[\-•\*]\s*/, "")
    .trim();

const likelyPlaceTokenPattern =
  /(\b(?:temple|church|mosque|museum|park|beach|lake|waterfall|fort|palace|garden|cathedral|monument|street|market|bazaar|cruise|island|harbor|railway|tower|viewpoint|shopping mall|aquarium)\b)/i;



const extractCandidatesFromLine = (line) => {
  const l = line ?? "";
  const trimmed = l.trim();
  if (!trimmed) return [];

  // If AI uses patterns like "Morning: Visit Taj Mahal" or "Visit - Eiffel Tower"
  const afterVisit = trimmed
    .replace(/^\s*(morning|afternoon|evening)\s*[:\-]\s*/i, "")
    .replace(/^\s*(visit|explore|tour|head to|go to)\s*[:\-]?\s*/i, "");

  const candidates = [];

  // Prefer the part after common verbs
  if (afterVisit && afterVisit !== trimmed) {
    candidates.push(cleanPlaceName(afterVisit));
  }

  // Split bullets/commas, keep first few chunks
  const chunks = trimmed
    .replace(/^\s*[\-•\*]\s*/, "")
    .split(/,|\s\+\s|\||\u2022/)
    .map((c) => cleanPlaceName(c))
    .map((c) => c.replace(/^:\s*/, ""))
    .map((c) => c.replace(/\([^)]*\)/g, "").trim());

  for (const c of chunks) {
    if (!c) continue;
    // Remove pure time fragments
    if (/^\d{1,2}(:\d{2})?\s*(am|pm)$/i.test(c)) continue;
    candidates.push(c);
  }

  // Keep only those that look like places OR are reasonably short and alphabetic
  const filtered = candidates
    .map(normalizeCandidate)
    .filter(Boolean)
    .map((c) => c.replace(/\d+\s*(?:per\s*person|nights|night|days|day)?\s*/i, "").trim())
    .map((c) => c.replace(/\b₹\s*\d+[\d,]*/g, "").trim())
    .map((c) => c.replace(/\b(per\s*person|per\s*entry|entrance|parking)\b/gi, "").trim())
    .filter((c) => {
      if (!c) return false
      if (likelyPlaceTokenPattern.test(c)) return true;
      // Heuristic: exclude overly long sentences
      if (c.length > 60) return false;
      // must contain at least one letter
      if (!/[a-zA-Z]/.test(c)) return false;
      // exclude obvious generic words
      if (/^(breakfast|lunch|dinner|hotel|stay|transport|travel tips|budget|estimated expenses|total|tip)$/i.test(c)) return false;
      return true;
    });

  // de-dupe
  return Array.from(new Set(filtered));
};

export function extractLocationsFromDays(days, opts = {}) {
  const { maxPlaces = 15 } = opts;
  const nameSet = new Set();

  for (const d of days ?? []) {
    const content = d?.content ?? "";
    const lines = content.toString().split(/\r?\n/);

    // Try to extract from each line
    for (const line of lines) {
      const candidates = extractCandidatesFromLine(line);
      for (const c of candidates) {
        if (nameSet.size >= maxPlaces) break;
        nameSet.add(c);
      }
      if (nameSet.size >= maxPlaces) break;
    }

    if (nameSet.size >= maxPlaces) break;
  }

  return Array.from(nameSet);
}

export async function geocodeLocations(names, opts = {}) {
  const {
    userAgent = "ai-travel-planner/1.0 (leaflet)",
    maxToGeocode = 12,
    timeoutMs = 10000,
    cacheKey = "itinerary-geocode-cache-v1",
    // If the browser blocks Nominatim (CORS / network), we can’t geocode client-side.
    // This flag keeps failures graceful.
    swallowNetworkErrors = true,
  } = opts;


  const storageCache =
    typeof window !== "undefined" && window.localStorage
      ? (() => {
          try {
            return JSON.parse(window.localStorage.getItem(cacheKey) || "{}") || {};
          } catch {
            return {};
          }
        })()
      : {};

  const results = [];
  const seen = new Set();

  const list = (names ?? []).filter(Boolean).slice(0, maxToGeocode);

  const saveCache = (next) => {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    for (const name of list) {
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      if (storageCache?.[key]?.lat && storageCache?.[key]?.lng) {
        results.push({ name, lat: storageCache[key].lat, lng: storageCache[key].lng });
        continue;
      }

      // Keep query short and focused; itinerary sentences often include timing/budget/text
      const query = name
        .replace(/\bhttps?:\/\/\S+/gi, "")
        .replace(/\([^)]*\)/g, " ")
        .replace(/\b\d{1,4}\b/g, " ")
        .replace(/\b₹\s*\d+[\d,]*/g, "")
        .replace(/\s+/g, " ")
        .trim()

      if (!query || query.length < 3) continue

      // Prefer backend proxy to avoid browser CORS/network restrictions.
      const proxyUrl = `/api/map/geocode?q=${encodeURIComponent(query)}`;

      let data = null;
      try {
        const res = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
          },
        });

        if (res.ok) {
          const json = await res.json();
          data = json?.results;
        }
      } catch (e) {
        if (!swallowNetworkErrors) throw e;
      }

      // Fallback (best-effort) to direct Nominatim from browser.
      if (!Array.isArray(data)) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

        try {
          const res = await fetch(url, {
            signal: controller.signal,
            headers: {
              "Accept": "application/json",
              "User-Agent": userAgent,
            },
          });

          if (res.ok) {
            data = await res.json();
          }
        } catch {
          if (!swallowNetworkErrors) throw new Error("Geocoding fetch failed");
        }
      }

      const first = Array.isArray(data) ? data[0] : null;
      if (!first) continue;

      // Backend proxy returns {lat,lng,name}
      const latRaw = first.lat ?? first?.lat;
      const lngRaw = first.lng ?? first?.lon;

      const lat = Number(first.lat ?? first?.lat);
      const lng = Number(first.lng ?? first?.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      // Use best available display name
      const resolvedName = first.name || first?.display_name || query;

      results.push({ name: resolvedName, lat, lng });
      if (storageCache) {
        storageCache[key] = { lat, lng };
        saveCache(storageCache);
      }
      continue;

    }
  } finally {
    clearTimeout(timeout);
  }

  return results;
}

