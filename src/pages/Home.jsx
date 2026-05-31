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

const ALL_DESTINATIONS = [
  { name: "Paris", rating: "4.8", weather: "18–26°C", budget: "₹45k–₹80k", duration: "5–7 days", category: "International", trending: false, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
  { name: "Bali", rating: "4.7", weather: "24–30°C", budget: "₹40k–₹75k", duration: "6–8 days", category: "International", trending: true, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80" },
  { name: "Tokyo", rating: "4.9", weather: "14–25°C", budget: "₹70k–₹1.1L", duration: "6–10 days", category: "International", trending: false, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80" },
  { name: "Switzerland", rating: "4.8", weather: "10–20°C", budget: "₹90k–₹1.4L", duration: "7–10 days", category: "Mountains", trending: false, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80" },
  { name: "Goa", rating: "4.6", weather: "26–32°C", budget: "₹15k–₹35k", duration: "4–6 days", category: "Beach", trending: true, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80" },
  { name: "Rajasthan", rating: "4.8", weather: "20–35°C", budget: "₹20k–₹50k", duration: "7–10 days", category: "Heritage", trending: true, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80" },
  { name: "Kerala", rating: "4.9", weather: "22–30°C", budget: "₹18k–₹45k", duration: "5–7 days", category: "Nature", trending: true, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80" },
  { name: "Ladakh", rating: "4.9", weather: "0–20°C", budget: "₹25k–₹60k", duration: "7–10 days", category: "Mountains", trending: true, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80" },
  { name: "Varanasi", rating: "4.7", weather: "18–32°C", budget: "₹10k–₹25k", duration: "3–5 days", category: "Heritage", trending: false, image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80" },
  { name: "Andaman", rating: "4.8", weather: "24–30°C", budget: "₹30k–₹65k", duration: "5–7 days", category: "Beach", trending: false, image: andamanImg },
  { name: "Rishikesh", rating: "4.7", weather: "15–28°C", budget: "₹8k–₹20k", duration: "3–5 days", category: "Adventure", trending: true, image: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800&q=80" },
  { name: "Jaipur", rating: "4.7", weather: "22–38°C", budget: "₹12k–₹30k", duration: "3–5 days", category: "Heritage", trending: false, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80" },
  { name: "Coorg", rating: "4.6", weather: "16–24°C", budget: "₹12k–₹28k", duration: "3–4 days", category: "Nature", trending: false, image: coorgImg },
  { name: "Mumbai", rating: "4.5", weather: "24–34°C", budget: "₹15k–₹40k", duration: "3–5 days", category: "City", trending: false, image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80" },
  { name: "Mysore", rating: "4.6", weather: "18–28°C", budget: "₹10k–₹22k", duration: "2–4 days", category: "Heritage", trending: false, image: mysoreImg },
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
    <div className="min-h-screen text-white bg-[#09090b] relative overflow-x-hidden">
      {/* Sweeping animated gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <motion.div 
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.15),transparent_60%)] blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15),transparent_60%)] blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative z-10 w-full min-h-[90vh] flex items-center justify-center pt-24 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 rounded-full mb-8 px-5 py-2.5 glass shadow-[0_0_20px_rgba(217,70,239,0.3)]"
            >
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              <span className="text-sm font-bold text-white/90">AI-powered itineraries in seconds</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-8xl font-extrabold leading-[1.0] tracking-tighter mb-6 drop-shadow-2xl">
              Plan Your<br />
              <span className="text-gradient drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]">
                Dream Trip
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/60 leading-relaxed mb-10 max-w-lg font-medium">
              Smart day-wise plans, hidden gems, real hotel prices — tailored perfectly to your style.
            </p>

            {/* Search bar */}
            <div className="w-full max-w-xl flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40 group-focus-within:text-fuchsia-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl text-lg text-white placeholder-white/40 outline-none transition-all duration-300 glass focus:ring-2 focus:ring-fuchsia-500/50 shadow-xl"
                />
              </div>
              <button
                onClick={startPlanning}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 bg-gradient-neon shadow-[0_0_30px_rgba(217,70,239,0.4)] hover:shadow-[0_0_50px_rgba(217,70,239,0.6)] hover:scale-105"
              >
                Plan Trip
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            
            <motion.a
              href="#destinations"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
              whileHover={{ y: 5 }}
            >
              <MapPin className="w-5 h-5" /> Browse popular destinations ↓
            </motion.a>
          </motion.div>

          {/* Right Hero Image / Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative hidden lg:block h-[600px] w-full"
          >
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImg}')` }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#09090b]/80 via-transparent to-transparent" />
            </div>
            
            {/* Floating UI Elements */}
            <motion.div 
              className="absolute -left-10 top-20 glass p-5 rounded-2xl flex items-center gap-4 shadow-2xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-neon flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">Instant Plans</p>
                <p className="text-white/50 text-sm">Under 60 seconds</p>
              </div>
            </motion.div>


          </motion.div>

        </div>
      </section>

      {/* ── BENTO GRID FEATURES ───────────────────────────── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2 glass-card rounded-[2rem] p-8 sm:p-12 flex flex-col justify-end min-h-[350px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Clock className="w-12 h-12 text-fuchsia-400 mb-6 relative z-10" />
            <h3 className="text-3xl font-bold mb-3 relative z-10">Day-wise Detail</h3>
            <p className="text-white/60 text-lg max-w-md relative z-10">
              Morning, afternoon, and evening breakdowns. We plan your travel routes so you don't waste time in transit.
            </p>
          </div>
          
          <div className="glass-card rounded-[2rem] p-8 sm:p-12 flex flex-col justify-end min-h-[350px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Shield className="w-12 h-12 text-cyan-400 mb-6 relative z-10" />
            <h3 className="text-3xl font-bold mb-3 relative z-10">Budget Smart</h3>
            <p className="text-white/60 text-lg relative z-10">
              Accurate cost estimates for flights, hotels, and food.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── DESTINATIONS ──────────────────────────────────── */}
      <section id="destinations" className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-8">
        
        <div className="flex flex-col items-center justify-center gap-6 mb-8">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeFilter === tab ? "text-white" : "text-white/60 hover:text-white glass"
                }`}
              >
                {activeFilter === tab && (
                  <motion.div
                    layoutId="filter-indicator"
                    className="absolute inset-0 bg-gradient-neon rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Destination grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full glass-card rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
                <MapPin className="w-16 h-16 text-white/20 mb-6" />
                <h3 className="text-2xl font-bold mb-2">No places found</h3>
                <p className="text-white/50">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              filtered.map((d, i) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={selected?.name === d.name ? "ring-2 ring-fuchsia-500 rounded-3xl ring-offset-4 ring-offset-[#09090b]" : ""}
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
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="mt-12 sticky bottom-8 z-50"
            >
              <div className="glass-card rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-fuchsia-500/30">
                <div className="flex items-center gap-6 w-full">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${selected.image}')` }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-fuchsia-400 mb-1 tracking-wider uppercase">Ready to go</p>
                    <p className="text-3xl font-extrabold">{selected.name}</p>
                    <p className="text-white/60 text-sm mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selected.duration}</span>
                      <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {selected.rating}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={startPlanning}
                  className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white transition-all bg-gradient-neon hover:shadow-[0_0_40px_rgba(217,70,239,0.5)] hover:scale-105"
                >
                  Plan {selected.name} <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="relative z-10 w-full border-t border-white/10 mt-20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">WanderGo</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white/50 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
