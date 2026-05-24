import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, Sparkles, Wallet, MapPin, Plane, Users, Flame } from "lucide-react"

import Navbar from "../components/Navbar"
import API from "../services/api"
import GlassCard from "../components/ui/GlassCard"
import Spinner from "../components/ui/Spinner"

function Planner() {
  const navigate = useNavigate()
  const location = useLocation()

  const presetDestination = useMemo(() => {
    return location?.state?.destination || ""
  }, [location?.state])

  const [formData, setFormData] = useState({
    destination: "",
    budget: "",
    days: "",
    interest: "",
  })

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (presetDestination && !formData.destination) {
      setFormData((p) => ({ ...p, destination: presetDestination }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetDestination])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const canSubmit =
    formData.destination.trim() &&
    String(formData.budget).trim() &&
    String(formData.days).trim() &&
    formData.interest

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setProgress(0)

    // Fake progress for better UX while waiting for AI
    const timer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 7 : p))
    }, 220)

    try {
      const response = await API.post("/trip/generate-trip", formData)
      setProgress(100)

      navigate("/result", {
        state: {
          formData,
          tripPlan: response?.data?.tripPlan ?? "",
        },
      })
    } catch (error) {
      console.error(error)
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to generate trip"
      alert(message)
      setProgress(0)
    } finally {
      clearInterval(timer)
      setLoading(false)
    }
  }

  const InterestOptions = [
    { value: "Adventure", label: "Adventure" },
    { value: "Nature", label: "Nature" },
    { value: "Food", label: "Food" },
    { value: "Beach", label: "Beach" },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(170,59,255,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_10%,rgba(245,158,11,0.22),transparent_55%),linear-gradient(180deg,#0b0b10,#141427)] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 text-white/80">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </span>
            <div>
              <p className="text-sm">AI Trip Planner</p>
              <h1 className="text-3xl sm:text-4xl font-bold">Generate your itinerary</h1>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3">
            <GlassCard>
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/70 inline-flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-yellow-200" /> Destination
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="destination"
                          placeholder="e.g. Bali"
                          value={formData.destination}
                          onChange={handleChange}
                          className="w-full p-3 rounded-xl bg-white/5 ring-1 ring-white/10 outline-none focus:ring-yellow-300/40 focus:bg-white/7 transition"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-white/70 inline-flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-purple-200" /> Budget (₹)
                      </label>
                      <input
                        type="number"
                        name="budget"
                        placeholder="e.g. 60000"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-white/5 ring-1 ring-white/10 outline-none focus:ring-yellow-300/40 focus:bg-white/7 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/70 inline-flex items-center gap-2">
                        <Plane className="w-4 h-4 text-cyan-200" /> Days
                      </label>
                      <input
                        type="number"
                        name="days"
                        placeholder="e.g. 7"
                        value={formData.days}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-white/5 ring-1 ring-white/10 outline-none focus:ring-yellow-300/40 focus:bg-white/7 transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-white/70 inline-flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-200" /> Travel style
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-white/5 ring-1 ring-white/10 outline-none focus:ring-yellow-300/40 focus:bg-white/7 transition"
                        required
                      >
                        <option value="" className="text-black">
                          Select Interest
                        </option>
                        {InterestOptions.map((o) => (
                          <option key={o.value} value={o.value} className="text-black">
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>AI generation</span>
                      <span>{loading ? `${progress}%` : "Ready"}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 ring-1 ring-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-300 to-fuchsia-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition disabled:opacity-60 disabled:hover:bg-yellow-400"
                    whileHover={loading ? undefined : { y: -1 }}
                    whileTap={loading ? undefined : { scale: 0.99 }}
                  >
                    {loading ? (
                      <>
                        <Spinner />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Trip
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-white/60 leading-relaxed">
                    Tip: picking a destination on Home will automatically prefill this form.
                  </p>
                </form>
              </div>
            </GlassCard>
          </div>

          {/* Side cards */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <motion.div whileHover={{ y: -3 }}>
                <GlassCard>
                  <div className="p-5">
                    <p className="text-white/70 text-sm">What you get</p>
                    <h3 className="text-xl font-bold mt-1">Day-wise itinerary</h3>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                      <li>• Places to visit + timing</li>
                      <li>• Food suggestions</li>
                      <li>• Hotels & estimated expenses</li>
                      <li>• Travel tips</li>
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div whileHover={{ y: -3 }}>
                <GlassCard>
                  <div className="p-5">
                    <p className="text-white/70 text-sm">Fast workflow</p>
                    <h3 className="text-xl font-bold mt-1">1 minute to results</h3>
                    <div className="mt-3 flex gap-3">
                      <div className="flex-1 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                        <p className="text-xs text-white/60">Step 1</p>
                        <p className="font-semibold">Choose style</p>
                      </div>
                      <div className="flex-1 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                        <p className="text-xs text-white/60">Step 2</p>
                        <p className="font-semibold">Generate</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Planner
