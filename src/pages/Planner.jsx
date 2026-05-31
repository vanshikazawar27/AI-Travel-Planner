import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Sparkles, Wallet, MapPin, Plane, Users, Flame, ChevronRight } from "lucide-react"

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
  }, [presetDestination])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInterestSelect = (interest) => {
    setFormData((prev) => ({ ...prev, interest }))
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

    const timer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 5 : p))
    }, 300)

    try {
      const response = await API.post("/trip/generate-trip", formData)
      setProgress(100)

      setTimeout(() => {
        navigate("/result", {
          state: {
            formData,
            tripPlan: response?.data ?? {},
          },
        })
      }, 500)
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.error || error?.message || "Failed to generate trip")
      setProgress(0)
    } finally {
      clearInterval(timer)
      setLoading(false)
    }
  }

  const InterestOptions = [
    { value: "Adventure", label: "Adventure", icon: Flame, color: "text-orange-400" },
    { value: "Nature", label: "Nature", icon: MapPin, color: "text-green-400" },
    { value: "Food", label: "Food", icon: Sparkles, color: "text-yellow-400" },
    { value: "Beach", label: "Beach", icon: Plane, color: "text-cyan-400" },
  ]

  return (
    <div className="min-h-screen text-white bg-[#09090b] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <motion.div 
          className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.1),transparent_60%)] blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),transparent_60%)] blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass shadow-[0_0_15px_rgba(217,70,239,0.2)] mb-4">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-bold text-white/90">AI Generator</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Design your perfect <span className="text-gradient">itinerary</span>
          </h1>
          <p className="text-white/60 text-lg sm:text-xl leading-relaxed px-4">
            Tell us where you're going and what you love. We'll handle the logistics, timeline, and budget.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <GlassCard className="p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Destination & Days */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2 uppercase tracking-wider">
                      <MapPin className="w-4 h-4 text-fuchsia-400" /> Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      placeholder="Where to? (e.g. Kyoto)"
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all duration-300 text-lg shadow-inner"
                      required
                    />
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-sm font-bold text-white/80 flex items-center gap-2 uppercase tracking-wider">
                      <Plane className="w-4 h-4 text-cyan-400" /> Duration (Days)
                    </label>
                    <input
                      type="number"
                      name="days"
                      min="1"
                      placeholder="e.g. 5"
                      value={formData.days}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 text-lg shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-3 group">
                  <label className="text-sm font-bold text-white/80 flex items-center gap-2 uppercase tracking-wider">
                    <Wallet className="w-4 h-4 text-yellow-400" /> Total Budget (₹)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    placeholder="e.g. 50000"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300 text-lg shadow-inner"
                    required
                  />
                </div>

                {/* Travel Style Grid */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/80 flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Travel Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {InterestOptions.map((opt) => {
                      const isSelected = formData.interest === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleInterestSelect(opt.value)}
                          className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                            isSelected 
                              ? "bg-fuchsia-500/20 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] text-white" 
                              : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white"
                          }`}
                        >
                          <opt.icon className={`w-6 h-6 ${isSelected ? opt.color : "text-white/40"}`} />
                          <span className="font-semibold text-sm">{opt.label}</span>
                          {isSelected && (
                            <motion.div
                              layoutId="interest-outline"
                              className="absolute inset-0 rounded-2xl border-2 border-fuchsia-500"
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Generate Button & Progress */}
                <div className="pt-6 border-t border-white/10">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between font-bold text-fuchsia-400">
                          <span className="flex items-center gap-2 animate-pulse"><Loader2 className="w-5 h-5 animate-spin" /> Synthesizing Trip...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/5 overflow-hidden ring-1 ring-white/10">
                          <motion.div
                            className="h-full bg-gradient-neon shadow-[0_0_10px_rgba(217,70,239,0.8)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-bold text-lg text-white transition-all bg-gradient-neon hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed hover:scale-[1.02]"
                      >
                        Generate Itinerary
                        <ChevronRight className="w-6 h-6" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </GlassCard>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-6 bg-gradient-to-br from-fuchsia-900/20 to-transparent">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" /> What's Included?
                </h3>
                <ul className="space-y-3 text-white/70 text-sm font-medium">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 mt-1.5 shrink-0" />
                    <span>Detailed morning-to-night schedule optimized for travel time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>Curated hotel recommendations fitting your exact budget.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                    <span>Top-rated local food spots and hidden gems.</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-fuchsia-400" /> AI Magic
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Our algorithm processes thousands of travel reviews, weather data, and location proximity to ensure your itinerary is not just a list of places, but a deeply logical, highly enjoyable travel route.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Planner
