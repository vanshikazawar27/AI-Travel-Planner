import React, { useMemo } from "react"

import { extractLocationsFromDays } from "../utils/itineraryLocations"

export default function DebugMapCandidates({ visible, days, mapLocations }) {
  const candidates = useMemo(() => {
    if (!visible) return []
    return extractLocationsFromDays(days ?? [], { maxPlaces: 15 })
  }, [visible, days])

  if (!visible) return null

  return (
    <div className="mt-4 rounded-xl ring-1 ring-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">Debug (candidates & geocoded results)</div>
      <div className="mt-2 text-sm text-white/85">
        <div>
          <span className="font-semibold">Candidates ({candidates.length}): </span>
          <span className="text-white/70">{candidates.join(" | ") || "-"}</span>
        </div>
        <div className="mt-2">
          <span className="font-semibold">Geocoded ({mapLocations?.length ?? 0}): </span>
          <span className="text-white/70">
            {(mapLocations ?? [])
              .map((x) => `${x.name} (${x.lat?.toFixed?.(3) ?? x.lat}, ${x.lng?.toFixed?.(3) ?? x.lng})`)
              .join(" | ") || "-"}
          </span>
        </div>
      </div>
    </div>
  )
}

