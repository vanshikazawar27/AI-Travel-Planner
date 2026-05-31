export const buildGoogleMapsDirectionsUrl = ({
  origin,
  destination,
  waypoints = [],
  travelMode = "driving",
}) => {
  // origin/destination/waypoints can be strings or {lat,lng}
  const toPlace = (p) => {
    if (!p) return "";
    if (typeof p === "string") return p;
    if (typeof p === "object" && Number.isFinite(p?.lat) && Number.isFinite(p?.lng)) {
      return `${p.lat},${p.lng}`;
    }
    return "";
  };

  const o = toPlace(origin);
  const d = toPlace(destination);
  const w = waypoints.map(toPlace).filter(Boolean);

  // waypoints param is a pipe-delimited list
  const waypointsParam = w.length ? w.join("|") : "";

  const params = new URLSearchParams();
  params.set("api", "1");
  params.set("origin", o);
  params.set("destination", d);
  params.set("travelmode", travelMode);
  if (waypointsParam) params.set("waypoints", waypointsParam);

  return `https://www.google.com/maps/dir/?${params.toString()}`;
};

