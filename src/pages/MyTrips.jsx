import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Trash2, Bookmark, Download } from "lucide-react"

import Navbar from "../components/Navbar"
import GlassCard from "../components/ui/GlassCard"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import { downloadText } from "../utils/downloadText"

function MyTrips() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchTrips = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await API.get("/trip/saved")
      setTrips(response.data)
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load saved trips.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const handleDelete = async (tripId) => {
    if (!window.confirm("Delete this saved trip?")) {
      return
    }

    try {
      await API.delete(`/trip/saved/${tripId}`)
      setTrips((current) => current.filter((trip) => trip._id !== tripId))
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to delete trip.")
    }
  }

  const getTripText = (trip) => {
    if (!trip?.tripPlan) return ""
    if (typeof trip.tripPlan === "string") return trip.tripPlan
    return trip.tripPlan.raw || JSON.stringify(trip.tripPlan, null, 2)
  }

  const handleDownload = (trip) => {
    const fileName = `${trip.destination || "trip"}-${new Date(trip.createdAt).toISOString().slice(0, 10)}.txt`
    const text = getTripText(trip)
    downloadText(fileName, text)
  }

  const handleView = (trip) => {
    navigate("/result", { state: { formData: trip.formData, tripPlan: trip.tripPlan } })
  }

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
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
            <Bookmark className="w-4 h-4 text-yellow-300" />
            Saved trips for {user?.name}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold">My saved itineraries</h1>
          <p className="text-white/70 mt-2">Open a saved trip or delete it when it’s no longer needed.</p>
        </motion.div>

        {loading ? (
          <GlassCard>
            <div className="p-8 text-center text-white/70">Loading saved trips…</div>
          </GlassCard>
        ) : error ? (
          <GlassCard>
            <div className="p-8 text-red-200">{error}</div>
          </GlassCard>
        ) : trips.length === 0 ? (
          <GlassCard>
            <div className="p-8 space-y-4">
              <p className="text-lg font-semibold">No saved trips yet.</p>
              <p className="text-white/70">Create your first trip in the planner, then save it from the result screen.</p>
              <button
                onClick={() => navigate("/planner")}
                className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black hover:bg-yellow-300 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Go to planner
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip) => (
              <GlassCard key={trip._id}>
                <div className="p-6 sm:flex sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-white/70">{new Date(trip.createdAt).toLocaleDateString()}</p>
                    <h2 className="mt-2 text-xl font-bold">{trip.destination} • {trip.days} days</h2>
                    <p className="mt-2 text-white/70 text-sm">Budget ₹{trip.budget} · {trip.interest} trip</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 sm:mt-0 sm:items-center">
                    <button
                      onClick={() => handleView(trip)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
                    >
                      View itinerary
                    </button>
                    <button
                      onClick={() => handleDownload(trip)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-black hover:bg-yellow-300 transition"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips
