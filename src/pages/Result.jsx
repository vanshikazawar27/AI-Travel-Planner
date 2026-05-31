import { useMemo, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Copy, Check, Bed, ForkKnife, DollarSign, MapPin, Info, BookmarkPlus, CalendarDays, Compass, Download, Share2, Sparkles } from "lucide-react"

import Navbar from "../components/Navbar"
import GlassCard from "../components/ui/GlassCard"
import Toast from "../components/ui/Toast"
import { parseTripPlan } from "../utils/parseTripPlan"
import { useAuth } from "../context/AuthContext"
import API from "../services/api"
import { extractLocationsFromDays, geocodeLocations } from "../utils/itineraryLocations"

function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" })
  const [expandedDays, setExpandedDays] = useState({})
  const [savedTripId, setSavedTripId] = useState(null)

  const [mapLoading, setMapLoading] = useState(false)
  const [mapError, setMapError] = useState("")
  const [mapLocations, setMapLocations] = useState([])

  const { isAuthenticated } = useAuth()

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type })
    window.clearTimeout(showToast.timeout)
    showToast.timeout = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }))
    }, 2500)
  }

  const locState = location.state || (typeof window !== 'undefined' && window.__INJECTED_TRIP__) || (typeof window !== 'undefined' && window.localStorage && (() => { try { return JSON.parse(window.localStorage.getItem('injectedTrip') || 'null') } catch { return null } })()) || {}
  const { formData, tripPlan } = locState || {}

  const { itinerary = [], raw = '', destinationIntro: apiDestinationIntro = null, metadata: apiMetadata = '' } = tripPlan || {}

  const formatDayText = (text) => {
    const cleaned = (text ?? "")
      .replace(/\*\*/g, "")
      .replace(/\*\s*/g, "• ")
      .replace(/\n{2,}/g, "\n")
      .trim()
    const lines = cleaned.split(/\n/).map((line) => line.trim()).filter((line) => line.length > 0)
    return lines.join("\n")
  }

  const getDayDisplay = (day) => {
    const fullText = formatDayText(day.content || day.details || "")
    const lines = fullText.split(/\n/)
    const isLong = lines.length > 7 || fullText.length > 320

    if (expandedDays[day.day] || !isLong) {
      return { text: fullText, truncated: false }
    }
    const truncatedText = lines.slice(0, 7).join("\n")
    return { text: truncatedText, truncated: true }
  }

  const toggleDayExpanded = (dayNumber) => {
    setExpandedDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
  }

  const { days, raw: parsedRaw, destinationIntro: parsedDestinationIntro = null, metadata: parsedMetadata = "" } = useMemo(() => {
    const rawString = typeof raw === "string" && raw ? raw : (typeof tripPlan === "string" ? tripPlan : tripPlan?.raw || "");
    const parsedFromRaw = typeof rawString === "string" && rawString ? parseTripPlan(rawString) : { days: [], metadata: "", destinationIntro: null };
    if (parsedFromRaw.days.length > 0) {
      return { days: parsedFromRaw.days, raw: rawString, metadata: parsedFromRaw.metadata || apiMetadata || "", destinationIntro: parsedFromRaw.destinationIntro || apiDestinationIntro };
    }
    if (Array.isArray(itinerary) && itinerary.length) {
      return { days: itinerary, raw: rawString, metadata: apiMetadata || parsedFromRaw.metadata || "", destinationIntro: apiDestinationIntro };
    }
    return parseTripPlan(rawString);
  }, [itinerary, tripPlan, raw, apiDestinationIntro, apiMetadata])

  const destinationIntro = apiDestinationIntro || parsedDestinationIntro
  const itineraryText = parsedRaw || (typeof tripPlan === 'string' ? tripPlan : '')
  const metadata = parsedMetadata || apiMetadata || ''

  const computeMapLocations = async (daysToUse) => {
    try {
      setMapLoading(true)
      setMapError("")
      const candidates = extractLocationsFromDays(daysToUse, { maxPlaces: 15 })
      if (!candidates.length) {
        setMapLocations([])
        return
      }
      const geocoded = await geocodeLocations(candidates, { maxToGeocode: 12, timeoutMs: 12000 })
      if (!geocoded.length) {
        setMapLocations([])
        return
      }
      const withDay = geocoded.map((loc) => {
        let day = null
        for (const d of daysToUse ?? []) {
          const content = (d?.content ?? "").toString()
          if (content.toLowerCase().includes(loc.name.toLowerCase())) {
            day = d.day
            break
          }
        }
        return { ...loc, day }
      })
      setMapLocations(withDay)
    } catch (e) {
      console.error(e)
      setMapError("Could not load map locations.")
    } finally {
      setMapLoading(false)
    }
  }

  useEffect(() => {
    if (!days || days.length === 0) return
    computeMapLocations(days)
  }, [days])

  const metadataSections = useMemo(() => {
    if (!metadata) return []
    const lines = metadata.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0)
    const headingRegex = /^(Hotel Suggestions|Hotels|Food Recommendations|Food Recommendation|Travel Tips|Budget Breakdown|Estimated Expenses|Total estimated expenses|Budget):?$/i
    const sections = []
    let current = { title: null, lines: [] }

    for (const line of lines) {
      const match = line.match(headingRegex)
      if (match) {
        if (current.title || current.lines.length) sections.push(current)
        current = { title: match[1], lines: [] }
        continue
      }
      current.lines.push(line)
    }
    if (current.title || current.lines.length) sections.push(current)
    return sections
  }, [metadata])

  const metadataIconMap = {
    "Hotel Suggestions": Bed, "Hotels": Bed,
    "Food Recommendations": ForkKnife, "Food Recommendation": ForkKnife,
    "Travel Tips": MapPin,
    "Budget Breakdown": DollarSign, "Estimated Expenses": DollarSign, "Total estimated expenses": DollarSign, "Budget": DollarSign,
    default: Info,
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(itineraryText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
      showToast("Itinerary copied to clipboard.", "success")
    } catch {
      showToast("Copy failed.", "error")
    }
  }

  if (!formData || !tripPlan) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          <GlassCard className="p-10 text-center">
            <h1 className="text-3xl font-extrabold mb-4">No itinerary found</h1>
            <p className="text-white/60 text-lg mb-8">Generate a trip first to see your customized plan.</p>
            <button
              onClick={() => navigate("/planner")}
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-neon text-white font-bold hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all hover:scale-105 gap-3"
            >
              <ArrowLeft className="w-5 h-5" /> Start Planning
            </button>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white bg-[#09090b] relative">
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.2),transparent_70%)] blur-3xl mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2),transparent_70%)] blur-3xl mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <Toast visible={toast.visible} message={toast.message} type={toast.type} onClose={() => setToast((current) => ({ ...current, visible: false }))} />

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass shadow-[0_0_15px_rgba(217,70,239,0.15)] mb-4 border border-fuchsia-500/30">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm font-bold text-fuchsia-100 uppercase tracking-wider">Your Personalized Itinerary</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
              {formData.destination}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-lg font-medium text-white/70">
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10"><CalendarDays className="w-5 h-5 text-cyan-400" /> {formData.days} Days</span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10"><Compass className="w-5 h-5 text-fuchsia-400" /> {formData.interest}</span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10"><DollarSign className="w-5 h-5 text-yellow-400" /> ₹{formData.budget}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigate("/planner", { state: { destination: formData.destination } })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl glass hover:bg-white/10 transition-colors text-sm font-bold w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4" /> Edit
            </button>
            
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl glass hover:bg-white/10 transition-colors text-sm font-bold flex-1 sm:flex-none justify-center"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy text"}
            </button>

            {saved && savedTripId && (
              <>
                <button
                  onClick={async () => {
                    try {
                      const response = await API.get(`/trip/saved/${savedTripId}?format=pdf`, { responseType: "blob" })
                      const url = window.URL.createObjectURL(new Blob([response.data]))
                      const link = document.createElement("a")
                      link.href = url
                      link.setAttribute("download", `${formData.destination || "trip"}.pdf`)
                      document.body.appendChild(link)
                      link.click()
                      link.remove()
                    } catch (err) {
                      showToast("Failed to download PDF", "error")
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold flex-1 sm:flex-none justify-center border border-white/10"
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await API.post("/trip/share", { savedTripId })
                      const link = response.data.url
                      await navigator.clipboard.writeText(link)
                      showToast("Share link copied!", "success")
                    } catch (err) {
                      showToast("Failed to generate share link", "error")
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-fuchsia-600/30 hover:bg-fuchsia-600/50 border border-fuchsia-500/50 transition-colors text-sm font-bold text-fuchsia-100 flex-1 sm:flex-none justify-center"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </>
            )}

            {isAuthenticated && (
              <button
                onClick={async () => {
                  if (saved) return
                  setSaving(true)
                  try {
                    const resp = await API.post("/trip/save", { formData, tripPlan })
                    if (resp.data?.savedTripId) setSavedTripId(resp.data.savedTripId)
                    setSaved(true)
                    showToast("Trip saved successfully.", "success")
                  } catch (error) {
                    showToast("Unable to save trip.", "error")
                  } finally {
                    setSaving(false)
                  }
                }}
                disabled={saving || saved}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-neon text-white transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] text-sm font-bold w-full sm:w-auto justify-center hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <BookmarkPlus className="w-5 h-5" /> {saved ? "Saved" : saving ? "Saving..." : "Save Trip"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Itinerary Timeline */}
          <div className="lg:col-span-8 space-y-6">
            {destinationIntro && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <GlassCard className="p-8 border-l-4 border-l-fuchsia-500">
                  <h3 className="text-xl font-extrabold mb-4 uppercase tracking-wider text-fuchsia-400">About {formData.destination}</h3>
                  <div className="whitespace-pre-wrap text-white/80 leading-relaxed text-lg font-medium">
                    {destinationIntro}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            <div className="relative pt-6">
              {/* Timeline line */}
              <div className="absolute left-[39px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-fuchsia-500/50 via-cyan-500/50 to-transparent hidden sm:block" />

              <div className="space-y-10">
                {days.length > 0 ? (
                  days.map((d, index) => {
                    const display = getDayDisplay(d)
                    return (
                      <motion.div
                        key={`day-${d.day}-${index}`}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="relative sm:pl-24"
                      >
                        {/* Timeline Node */}
                        <div className="absolute left-0 top-6 hidden sm:flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full glass border-2 border-fuchsia-500 flex flex-col items-center justify-center bg-[#09090b] shadow-[0_0_20px_rgba(217,70,239,0.3)] z-10">
                            <span className="text-xs text-white/60 font-bold uppercase tracking-widest">Day</span>
                            <span className="text-3xl font-black text-white">{d.day}</span>
                          </div>
                        </div>

                        <GlassCard className="p-8 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <h3 className="text-3xl font-extrabold mb-6 sm:hidden text-fuchsia-400">Day {d.day}</h3>
                          
                          <div className="relative z-10 text-white/80 leading-relaxed text-lg whitespace-pre-wrap">
                            {display.text}
                          </div>
                          
                          {display.truncated && (
                            <button
                              onClick={() => toggleDayExpanded(d.day)}
                              className="mt-6 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider flex items-center gap-2"
                            >
                              {expandedDays[d.day] ? "Collapse details" : "Read full day plan"}
                            </button>
                          )}
                        </GlassCard>
                      </motion.div>
                    )
                  })
                ) : (
                  <GlassCard className="p-8">
                    <pre className="whitespace-pre-wrap text-white/80 leading-relaxed font-sans text-lg">
                      {itineraryText}
                    </pre>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Extras */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32 h-fit">
            {metadataSections.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <GlassCard className="p-8 bg-gradient-to-b from-white/5 to-transparent">
                  <h3 className="text-2xl font-extrabold mb-8 pb-4 border-b border-white/10">Quick Reference</h3>
                  
                  <div className="space-y-8">
                    {metadataSections.map((section, sectionIndex) => {
                      const Icon = metadataIconMap[section.title] || metadataIconMap.default
                      return (
                        <div key={`metadata-section-${sectionIndex}`} className="group">
                          {section.title && (
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-fuchsia-500/20 group-hover:text-fuchsia-400 transition-colors border border-white/5 group-hover:border-fuchsia-500/30">
                                <Icon className="w-5 h-5 text-white group-hover:text-fuchsia-400 transition-colors" />
                              </div>
                              <h4 className="text-lg font-bold">{section.title}</h4>
                            </div>
                          )}
                          <div className="space-y-3 pl-13">
                            {section.lines.map((line, lineIndex) => (
                              <p key={`metadata-line-${sectionIndex}-${lineIndex}`} className="text-sm font-medium text-white/60 leading-relaxed relative before:content-[''] before:absolute before:-left-4 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-white/20">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Result
