import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Search, MapPin, Star, Zap, Clock, Shield } from "lucide-react"

import Navbar from "../components/Navbar"
import heroImg from "../assets/hero.png";
import andamanImg from "../assets/andaman.png";
import coorgImg from "../assets/coorg.png";
import mysoreImg from "../assets/mysore.png"
import DestinationCard from "../components/ui/DestinationCard"
import GlassCard from "../components/ui/GlassCard"

const ALL_DESTINATIONS = [
  // ── International ─────────────────────────────────────
  {
    name: "Paris",
    rating: "4.8",
    weather: "18–26°C",
    budget: "₹45k–₹80k",
    duration: "5–7 days",
    category: "International",
    trending: false,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bali",
    rating: "4.7",
    weather: "24–30°C",
    budget: "₹40k–₹75k",
    duration: "6–8 days",
    category: "International",
    trending: true,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tokyo",
    rating: "4.9",
    weather: "14–25°C",
    budget: "₹70k–₹1.1L",
    duration: "6–10 days",
    category: "International",
    trending: false,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Switzerland",
    rating: "4.8",
    weather: "10–20°C",
    budget: "₹90k–₹1.4L",
    duration: "7–10 days",
    category: "Mountains",
    trending: false,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  },

  // ── India ────────────────────────────────────────────
  {
    name: "Goa",
    rating: "4.6",
    weather: "26–32°C",
    budget: "₹15k–₹35k",
    duration: "4–6 days",
    category: "Beach",
    trending: true,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Rajasthan",
    rating: "4.8",
    weather: "20–35°C",
    budget: "₹20k–₹50k",
    duration: "7–10 days",
    category: "Heritage",
    trending: true,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kerala",
    rating: "4.9",
    weather: "22–30°C",
    budget: "₹18k–₹45k",
    duration: "5–7 days",
    category: "Nature",
    trending: true,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ladakh",
    rating: "4.9",
    weather: "0–20°C",
    budget: "₹25k–₹60k",
    duration: "7–10 days",
    category: "Mountains",
    trending: true,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Varanasi",
    rating: "4.7",
    weather: "18–32°C",
    budget: "₹10k–₹25k",
    duration: "3–5 days",
    category: "Heritage",
    trending: false,
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Andaman",
    rating: "4.8",
    weather: "24–30°C",
    budget: "₹30k–₹65k",
    duration: "5–7 days",
    category: "Beach",
    trending: false,
    image: andamanImg,
  },
  {
    name: "Rishikesh",
    rating: "4.7",
    weather: "15–28°C",
    budget: "₹8k–₹20k",
    duration: "3–5 days",
    category: "Adventure",
    trending: true,
    image: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Jaipur",
    rating: "4.7",
    weather: "22–38°C",
    budget: "₹12k–₹30k",
    duration: "3–5 days",
    category: "Heritage",
    trending: false,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Coorg",
    rating: "4.6",
    weather: "16–24°C",
    budget: "₹12k–₹28k",
    duration: "3–4 days",
    category: "Nature",
    trending: false,
    image: coorgImg,
  },
  {
    name: "Mumbai",
    rating: "4.5",
    weather: "24–34°C",
    budget: "₹15k–₹40k",
    duration: "3–5 days",
    category: "City",
    trending: false,
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mysore",
    rating: "4.6",
    weather: "18–28°C",
    budget: "₹10k–₹22k",
    duration: "2–4 days",
    category: "Heritage",
    trending: false,
    image: mysoreImg,
  },
]

const FILTER_TABS = ["All", "India", "Beach", "Mountains", "Heritage", "Adventure", "Nature", "International"]

function Home() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    let list = ALL_DESTINATIONS
    if (activeFilter !== "All") {
      if (activeFilter === "India") {
        const international = ["Paris", "Bali", "Tokyo", "Switzerland"]
        list = list.filter((d) => !international.includes(d.name))
      } else {
        list = list.filter((d) => d.category === activeFilter)
      }
    }
    if (searchQuery.trim()) {
      list = list.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return list
  }, [activeFilter, searchQuery])

  const startPlanning = () => {
    navigate("/planner", { state: selected ? { destination: selected.name } : {} })
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(1400px 700px at 10% 0%,rgba(170,59,255,0.22),transparent 60%),radial-gradient(900px 600px at 85% 5%,rgba(245,158,11,0.18),transparent 55%),linear-gradient(180deg,#08080f 0%,#0d0d1a 50%,#0a0a14 100%)",
      }}
    >
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <motion.section
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{ minHeight: "88vh" }}
      >
        {/* Background image — full bleed */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${heroImg}')`,
            opacity: 0.55,
          }}
        />
        {/* Layered gradients for depth */}
        <div className="absolute inset-0" style={{background: "linear-gradient(135deg,rgba(10,6,20,0.75) 0%,rgba(10,6,20,0.35) 50%,rgba(10,6,20,0.65) 100%)"}} />
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{background: "linear-gradient(to top, #08080f, transparent)"}} />

        <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-32">
          <motion.div
            className="max-w-3xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full mb-6 px-4 py-2"
              style={{background: "rgba(170,59,255,0.18)", border: "1px solid rgba(170,59,255,0.3)"}}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm text-white/90 font-medium">AI-powered itineraries in seconds</span>
            </motion.div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-7xl font-extrabold leading-[1.0] tracking-tight text-white mb-5"
              style={{ fontFamily: "'Outfit', sans-serif", textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}
            >
              Plan Your Dream
              <br />
              <span style={{ backgroundImage: "linear-gradient(90deg,#facc15,#c084fc,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Journey with AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl mb-8">
              Smart day-wise plans, hotels, food, estimated costs,
              and travel tips — tailored to your style.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/40 outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(12px)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(170,59,255,0.6)" }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)" }}
                />
              </div>
              <button
                onClick={startPlanning}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-black transition-all duration-200 shadow-lg hover:shadow-yellow-400/30 hover:scale-105"
                style={{background: "linear-gradient(135deg,#facc15,#f59e0b)"}}
              >
                Start Planning
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Explore link */}
            <motion.a
              href="#destinations"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition cursor-pointer"
              whileHover={{ x: 4 }}
            >
              <MapPin className="w-4 h-4" />
              Browse {ALL_DESTINATIONS.length}+ destinations ↓
            </motion.a>
          </motion.div>

          {/* Floating stat cards */}
          <motion.div
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {[
              { icon: <Zap className="w-5 h-5 text-yellow-300" />, title: "Instant Plans", sub: "AI generates in < 60 sec" },
              { icon: <Clock className="w-5 h-5 text-purple-300" />, title: "Day-wise Detail", sub: "Morning to night covered" },
              { icon: <Shield className="w-5 h-5 text-cyan-300" />, title: "Budget Smart", sub: "Cost estimates included" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl" style={{background: "rgba(255,255,255,0.1)"}}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── DESTINATIONS ──────────────────────────────────── */}
      <section id="destinations" className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-16">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-2">Explore</p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2
              className="text-4xl sm:text-5xl font-extrabold text-white"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Where to next?
            </h2>
            <p className="text-white/50 text-sm">Tap a destination to prefill your planner</p>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={
                activeFilter === tab
                  ? {
                      background: "linear-gradient(135deg,#aa3bff,#f59e0b)",
                      color: "#fff",
                      boxShadow: "0 4px 20px rgba(170,59,255,0.35)",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.65)",
                    }
              }
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Destination grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-16 text-white/40">
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-lg">No destinations found. Try a different filter.</p>
              </div>
            ) : (
              filtered.map((d, i) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className={selected?.name === d.name ? "ring-2 ring-yellow-400 rounded-2xl" : ""}
                >
                  <DestinationCard {...d} onClick={() => setSelected(d)} />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Selected destination CTA */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="mt-8"
            >
              <div
                className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${selected.image}')` }} />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-0.5">Selected destination</p>
                    <p className="text-2xl font-bold" style={{fontFamily: "'Outfit', sans-serif"}}>{selected.name}</p>
                    <p className="text-white/60 text-sm mt-0.5 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {selected.duration}
                      <span className="mx-1">•</span>
                      {selected.budget}
                      <span className="mx-1">•</span>
                      <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" /> {selected.rating}
                    </p>
                  </div>
                </div>
                <button
                  onClick={startPlanning}
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black transition-all hover:scale-105"
                  style={{background: "linear-gradient(135deg,#facc15,#f59e0b)"}}
                >
                  Plan {selected.name}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── STATS / WHY AI SECTION ─────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-10 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(170,59,255,0.12) 0%,rgba(245,158,11,0.08) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">Why AI Travel Planner?</p>
                <h3
                  className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Ready to generate<br />your itinerary?
                </h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  Enter your destination, budget, and travel style. Our AI builds
                  a complete day-wise plan with real hotel suggestions, food spots,
                  and budget breakdowns in under 60 seconds.
                </p>
                <button
                  onClick={() => navigate("/planner")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-black transition-all hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
                  style={{background: "linear-gradient(135deg,#facc15,#f59e0b)"}}
                >
                  Go to Planner
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "15+", label: "Destinations", color: "#c084fc" },
                  { value: "< 60s", label: "Generation time", color: "#facc15" },
                  { value: "100%", label: "Free to use", color: "#34d399" },
                  { value: "AI", label: "Powered by Gemma", color: "#f97316" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.04 }}
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p className="text-3xl font-extrabold mb-1" style={{ color: stat.color, fontFamily: "'Outfit', sans-serif" }}>
                      {stat.value}
                    </p>
                    <p className="text-white/50 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="w-full border-t border-white/5 mt-4">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Sparkles className="w-4 h-4 text-yellow-400/60" />
            <span>AI Travel Planner — Built with OpenRouter &amp; React</span>
          </div>
          <p className="text-white/25 text-xs">Powered by Google Gemma 3</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
