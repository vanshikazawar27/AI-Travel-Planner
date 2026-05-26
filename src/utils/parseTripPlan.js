const cleanupText = (text) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*\s*/g, "• ")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim()
}

const isIntroContent = (text) => {
  const normalized = text.toLowerCase()
  const introSignals = [
    "given your interest",
    "land of",
    "travel itinerary",
    "curated a",
    "get ready",
    "best culinary",
    "welcome to",
    "within a budget"
  ]
  const planSignals = [
    "morning",
    "afternoon",
    "evening",
    "breakfast",
    "lunch",
    "dinner",
    "hotel",
    "transport",
    "visit",
    "explore",
    "tour",
    "stay",
    "drive",
    "arrival",
    "departure"
  ]

  const introCount = introSignals.reduce(
    (count, token) => count + (normalized.includes(token) ? 1 : 0),
    0
  )
  const planCount = planSignals.reduce(
    (count, token) => count + (normalized.includes(token) ? 1 : 0),
    0
  )

  return introCount >= 1 && planCount <= 2
}

const isMetadataHeading = (line) => {
  return /^(?:\*+|[-•]\s*)?\s*(?:hotels?|hotel suggestions?|accommodation|stay|lodging|food recommendations?|food recommendation|dining|restaurant|meal|travel tips?|tips|estimated expenses?|estimated expense|budget breakdown|total estimated expenses?|costs?|expenses?|budget):?/i.test(line)
}

// Very lightweight parser that tries to split a text itinerary into day blocks.
// If the AI output format changes, it gracefully falls back to the raw text.
export function parseTripPlan(tripPlan) {
  const text = cleanupText(tripPlan ?? "")
  if (!text) return { days: [], raw: "" }

  const lines = text.split(/\r?\n/)

  // Heuristic: detect headings like "Day 1" / "Day 01" / "Day-1".
  const dayRegex = /^\s*day\s*[-:]?\s*(\d{1,2})\b/i

  const days = []
  let current = null

  for (const line of lines) {
    const m = line.match(dayRegex)
    if (m) {
      if (current) days.push(current)
      current = { day: Number(m[1]), content: [line.replace(dayRegex, "")] }
      continue
    }

    if (current) current.content.push(line)
  }

  if (current) days.push(current)

  // If we found no days, fall back.
  if (days.length === 0) return { days: [], raw: text }

  // Normalize/clean content
  const normalizedDays = days
    .sort((a, b) => a.day - b.day)
    .map((d) => {
      const lines = d.content
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      const contentLines = []
      const metadataLines = []
      let collectingMetadata = false

      for (const line of lines) {
        if (!collectingMetadata && isMetadataHeading(line)) {
          collectingMetadata = true
        }

        if (collectingMetadata) {
          metadataLines.push(line)
        } else {
          contentLines.push(line)
        }
      }

      return {
        day: d.day,
        content: contentLines.join("\n").trim(),
        metadata: metadataLines,
        intro: isIntroContent(contentLines.join("\n").trim()),
      }
    })

  const uniqueDays = Array.from(
    normalizedDays.reduce((map, day) => {
      if (!map.has(day.day)) {
        map.set(day.day, day)
      }
      return map
    }, new Map()).values()
  )

  let destinationIntro = null
  let finalDays = uniqueDays
  if (uniqueDays.length > 1 && uniqueDays[0].intro) {
    destinationIntro = uniqueDays[0].content
    finalDays = uniqueDays.slice(1).map((d, index) => ({
      ...d,
      day: index + 1,
    }))
  }

  const metadata = uniqueDays
    .flatMap((d) => d.metadata || [])
    .join("\n")
    .trim()

  return { days: finalDays, raw: text, destinationIntro, metadata }
}

