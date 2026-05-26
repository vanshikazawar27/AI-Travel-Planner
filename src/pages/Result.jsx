import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Copy, Check } from "lucide-react"

import Navbar from "../components/Navbar"
import GlassCard from "../components/ui/GlassCard"
import { parseTripPlan } from "../utils/parseTripPlan"
import { downloadText } from "../utils/downloadText"

function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false);

  const { formData, tripPlan } = location.state || {};

  // Extract structured data if available
  const { itinerary = [], raw = '' } = tripPlan || {};

  // Determine days and raw itinerary text
  const { days, raw: parsedRaw } = useMemo(() => {
    // If backend provided an array of day sections
    if (Array.isArray(itinerary) && itinerary.length) {
      return { days: itinerary, raw: raw };
    }
    // Fallback to parsing the raw string output
    return parseTripPlan(tripPlan);
  }, [itinerary, tripPlan, raw]);

  const itineraryText = parsedRaw || (typeof tripPlan === 'string' ? tripPlan : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(itineraryText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      alert("Copy failed")
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
            <button
              onClick={() =>
                downloadText(
                  `${formData.destination}-itinerary.txt`,
                  itineraryText
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 transition text-sm font-semibold"
            >
              <Download className="w-4 h-4" /> Download
            </button>
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

          {days.length > 0 ? (
            days.map((d) => (
              <motion.div
                key={d.day}
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
                        {d.details || d.content}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
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
