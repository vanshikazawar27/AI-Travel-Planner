import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, Check, Bed, ForkKnife, DollarSign, MapPin, Info, BookmarkPlus } from "lucide-react"


import Navbar from "../components/Navbar"
import GlassCard from "../components/ui/GlassCard"
import Toast from "../components/ui/Toast"
import { parseTripPlan } from "../utils/parseTripPlan"
import { downloadText } from "../utils/downloadText"
import { useAuth } from "../context/AuthContext"
import API from "../services/api"

function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [expandedDays, setExpandedDays] = useState({});
  const [savedTripId, setSavedTripId] = useState(null);
  const { isAuthenticated } = useAuth()

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type })
    window.clearTimeout(showToast.timeout)
    showToast.timeout = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }))
    }, 2500)
  }

  const locState = location.state || (typeof window !== 'undefined' && window.__INJECTED_TRIP__) || (typeof window !== 'undefined' && window.localStorage && (() => { try { return JSON.parse(window.localStorage.getItem('injectedTrip') || 'null') } catch { return null } })()) || {};
  const { formData, tripPlan } = locState || {};

  // Extract structured data if available
  const { itinerary = [], raw = '', destinationIntro: apiDestinationIntro = null, metadata: apiMetadata = '' } = tripPlan || {};

  const formatDayText = (text) => {
    const cleaned = (text ?? "")
      .replace(/\*\*/g, "")
      .replace(/\*\s*/g, "• ")
      .replace(/\n{2,}/g, "\n")
      .trim()

    const lines = cleaned
      .split(/\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    return lines.join("\n")
  }

  const getDayDisplay = (day) => {
    const fullText = formatDayText(day.content || day.details || "")
    const lines = fullText.split(/\n/)
    const isLong = lines.length > 7 || fullText.length > 320

    if (expandedDays[day.day] || !isLong) {
      return {
        text: fullText,
        truncated: false,
      }
    }

    const truncatedText = lines.slice(0, 7).join("\n")
    return {
      text: truncatedText,
      truncated: true,
    }
  }

  const toggleDayExpanded = (dayNumber) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }))
  }

  // Determine days and raw itinerary text
  const { days, raw: parsedRaw, destinationIntro: parsedDestinationIntro = null, metadata: parsedMetadata = "" } = useMemo(() => {
    const parsedFromRaw = typeof raw === "string" ? parseTripPlan(raw) : { days: [], metadata: "", destinationIntro: null }

    if (parsedFromRaw.days.length > 0) {
      return {
        days: parsedFromRaw.days,
        raw: raw,
        metadata: parsedFromRaw.metadata || apiMetadata || "",
        destinationIntro: parsedFromRaw.destinationIntro || apiDestinationIntro,
      }
    }

    if (Array.isArray(itinerary) && itinerary.length) {
      return {
        days: itinerary,
        raw: raw,
        metadata: apiMetadata || parsedFromRaw.metadata || "",
        destinationIntro: apiDestinationIntro,
      }
    }

    return parseTripPlan(tripPlan);
  }, [itinerary, tripPlan, raw, apiDestinationIntro]);

  const destinationIntro = apiDestinationIntro || parsedDestinationIntro;
  const itineraryText = parsedRaw || (typeof tripPlan === 'string' ? tripPlan : '');
  const metadata = parsedMetadata || apiMetadata || '';

  const metadataSections = useMemo(() => {
    if (!metadata) return []

    const lines = metadata
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const headingRegex = /^(Hotel Suggestions|Hotels|Food Recommendations|Food Recommendation|Travel Tips|Budget Breakdown|Estimated Expenses|Total estimated expenses|Budget):?$/i
    const sections = []
    let current = { title: null, lines: [] }

    for (const line of lines) {
      const match = line.match(headingRegex)
      if (match) {
        if (current.title || current.lines.length) {
          sections.push(current)
        }
        current = { title: match[1], lines: [] }
        continue
      }
      current.lines.push(line)
    }

    if (current.title || current.lines.length) {
      sections.push(current)
    }

    return sections
  }, [metadata])

  const metadataIconMap = {
    "Hotel Suggestions": Bed,
    Hotels: Bed,
    "Food Recommendations": ForkKnife,
    "Food Recommendation": ForkKnife,
    "Travel Tips": MapPin,
    "Budget Breakdown": DollarSign,
    "Estimated Expenses": DollarSign,
    "Total estimated expenses": DollarSign,
    Budget: DollarSign,
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
      <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(170,59,255,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_10%,rgba(245,158,11,0.22),transparent_55%),linear-gradient(180deg,#0b0b10,#141427)] text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <GlassCard>
            <div className="p-8">
              <h1 className="text-2xl font-bold">No itinerary found</h1>
              <p className="text-white/70 mt-2">Generate a trip first.</p>
              <button
                onClick={() => navigate("/planner")}
                className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition gap-2"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Planner
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(170,59,255,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_10%,rgba(245,158,11,0.22),transparent_55%),linear-gradient(180deg,#0b0b10,#141427)] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start justify-between gap-6 flex-wrap mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/10 px-4 py-2 mb-4">
              <span className="text-sm text-white/80">Your AI Travel Plan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Tailored itinerary</h1>
            <p className="text-white/70 mt-2">
              {formData.destination} • {formData.days} days • {formData.interest}
            </p>
          </div>

          <Toast
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((current) => ({ ...current, visible: false }))}
          />
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/15 transition text-sm font-semibold"
            >
              {copied ? (
                <Check className="w-4 h-4 text-yellow-300" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>

            {saved && savedTripId && (
              <>
                <button
                  onClick={async () => {
                    try {
                      const response = await API.get(`/trip/saved/${savedTripId}?format=pdf`, { responseType: "blob" });
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", `${formData.destination || "trip"}.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    } catch (err) {
                      console.error(err);
                      showToast("Failed to download PDF", "error");
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition text-sm font-semibold"
                >
                  PDF
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await API.post("/trip/share", { savedTripId });
                      const link = response.data.url;
                      await navigator.clipboard.writeText(link);
                      showToast("Share link copied!", "success");
                    } catch (err) {
                      console.error(err);
                      showToast("Failed to generate share link", "error");
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition text-sm font-semibold"
                >
                  Share
                </button>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={async () => {
                  if (saved) return;
                  setSaving(true);
                  try {
                    const resp = await API.post("/trip/save", { formData, tripPlan });
                    if (resp.data?.savedTripId) setSavedTripId(resp.data.savedTripId);
                    setSaved(true);
                    showToast("Trip saved successfully.", "success");
                  } catch (error) {
                    console.error("Save trip failed", error);
                    const message =
                      error?.response?.data?.message ||
                      error?.message ||
                      "Unable to save trip.";
                    showToast(message, "error");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving || saved}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/15 transition text-sm font-semibold"
              >
                <BookmarkPlus className="w-4 h-4" /> {saved ? "Saved" : saving ? "Saving..." : "Save trip"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GlassCard>
            <div className="p-5">
              <p className="text-sm text-white/70">Destination</p>
              <p className="text-xl font-bold mt-1">{formData.destination}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="p-5">
              <p className="text-sm text-white/70">Days</p>
              <p className="text-xl font-bold mt-1">{formData.days}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="p-5">
              <p className="text-sm text-white/70">Budget</p>
              <p className="text-xl font-bold mt-1">₹{formData.budget}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="p-5">
              <p className="text-sm text-white/70">Style</p>
              <p className="text-xl font-bold mt-1">{formData.interest}</p>
            </div>
          </GlassCard>
        </div>

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-bold">Day-wise itinerary</h2>
            <button
              onClick={() =>
                navigate("/planner", {
                  state: { destination: formData.destination },
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/15 transition text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Edit request
            </button>
          </div>

          {destinationIntro && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <GlassCard hoverLift={false}>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold">Destination</h3>
                    <div className="text-xs text-white/60 rounded-full bg-white/10 ring-1 ring-white/10 px-3 py-1">
                      Info
                    </div>
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-white/80 leading-relaxed text-sm">
                    {formData.destination}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
          {days.length > 0 ? (
            <>
              {days.map((d, index) => {
                const display = getDayDisplay(d)
                return (
                  <motion.div
                    key={`day-${d.day}-${index}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <GlassCard hoverLift={false}>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-bold">Day {d.day}</h3>
                          <div className="text-xs text-white/60 rounded-full bg-white/10 ring-1 ring-white/10 px-3 py-1">
                            Plan
                          </div>
                        </div>
                        <div className="mt-3 whitespace-pre-wrap text-white/80 leading-relaxed text-sm">
                          {display.text}
                        </div>
                        {display.truncated && (
                          <button
                            onClick={() => toggleDayExpanded(d.day)}
                            className="mt-3 text-sm font-semibold text-yellow-300 hover:text-yellow-200"
                          >
                            {expandedDays[d.day] ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                )
              })}

              {metadata && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <GlassCard hoverLift={false}>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-bold">Extra recommendations</h3>
                        <div className="text-xs text-white/60 rounded-full bg-white/10 ring-1 ring-white/10 px-3 py-1">
                          Extras
                        </div>
                      </div>
                      <div className="mt-3 space-y-6 text-white/80 leading-relaxed text-sm">
                        {metadataSections.map((section, sectionIndex) => {
                          const Icon = metadataIconMap[section.title] || metadataIconMap.default
                          return (
                            <div key={`metadata-section-${sectionIndex}`}>
                              {section.title && (
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon className="w-4 h-4 text-yellow-300" />
                                  <h4 className="text-base font-semibold text-white">{section.title}</h4>
                                </div>
                              )}
                              <div className="space-y-2">
                                {section.lines.map((line, lineIndex) => (
                                  <p key={`metadata-line-${sectionIndex}-${lineIndex}`} className="text-sm text-white/80">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </>
          ) : (
            <GlassCard hoverLift={false}>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Itinerary</h3>
                <pre className="whitespace-pre-wrap text-white/80 leading-relaxed text-sm">
                  {itineraryText}
                </pre>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Result
