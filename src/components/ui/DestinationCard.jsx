import { motion } from "framer-motion"
import { Star, ThermometerSun, Clock3, Wallet, TrendingUp } from "lucide-react"

export default function DestinationCard({
  image,
  name,
  rating,
  weather,
  budget,
  duration,
  category,
  trending,
  onClick,
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="text-left w-full"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="group relative rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/40 shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-purple-900/20 hover:ring-white/20 transition-all duration-300"
        style={{ height: "320px" }}
      >
        {/* Full-bleed image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url('${image}')` }}
        />

        {/* Gradient overlay — darker at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 group-hover:from-black/90 transition-all duration-300" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          {category && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md ring-1 ring-white/20 text-white/90">
              {category}
            </span>
          )}
          {trending && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-400/90 backdrop-blur-md text-black ml-auto">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* Glass info panel */}
          <div className="rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-white font-bold text-xl leading-tight tracking-tight" style={{fontFamily: "'Outfit', sans-serif"}}>
                {name}
              </h3>
              <div className="inline-flex items-center gap-1 shrink-0 rounded-full bg-yellow-400/20 ring-1 ring-yellow-400/30 px-2.5 py-1">
                <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span className="text-yellow-200 text-sm font-semibold">{rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-white/80">
                <ThermometerSun className="w-3.5 h-3.5 text-orange-300 shrink-0" />
                <span>{weather}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <Wallet className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="truncate">{budget}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <Clock3 className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>{duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
