// Very lightweight parser that tries to split a text itinerary into day blocks.
// If the AI output format changes, it gracefully falls back to the raw text.
export function parseTripPlan(tripPlan) {
  const text = (tripPlan ?? "").trim()
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
      current = { day: Number(m[1]), content: [line] }
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
    .map((d) => ({
      day: d.day,
      content: d.content.join("\n").trim(),
    }))

  return { days: normalizedDays, raw: text }
}

