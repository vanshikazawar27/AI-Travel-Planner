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
      className="text-left w-full relative group"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="relative rounded-3xl overflow-hidden glass shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30"
        style={{ height: "360px" }}
        variants={{
          hover: {
            y: -8,
          }
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Full-bleed image with zoom effect */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
          variants={{
            hover: { scale: 1.1 }
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/40 via-transparent to-transparent opacity-50" />

        {/* Top badges */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
          {category && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold glass text-white/90">
              {category}
            </span>
          )}
          {trending && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-neon text-white ml-auto shadow-[0_0_15px_rgba(217,70,239,0.5)]">
              <TrendingUp className="w-3.5 h-3.5" />
              Trending
            </span>
          )}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Glass info panel that expands on hover */}
          <motion.div 
            className="rounded-2xl glass p-4 transform origin-bottom"
            variants={{
              hover: {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.2)"
              }
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-white font-extrabold text-2xl leading-tight tracking-tight drop-shadow-md">
                {name}
              </h3>
              <div className="inline-flex items-center gap-1 shrink-0 rounded-full glass px-2.5 py-1 backdrop-blur-xl">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                <span className="text-white font-bold">{rating}</span>
              </div>
            </div>

            <motion.div 
              className="grid grid-cols-3 gap-2 text-xs font-medium"
              variants={{
                hover: { y: 0, opacity: 1 }
              }}
              initial={{ y: 5, opacity: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-1 text-white/80">
                <div className="flex items-center gap-1.5">
                  <ThermometerSun className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="text-white/60 text-[10px] uppercase tracking-wider">Temp</span>
                </div>
                <span>{weather}</span>
              </div>
              <div className="flex flex-col gap-1 text-white/80">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                  <span className="text-white/60 text-[10px] uppercase tracking-wider">Cost</span>
                </div>
                <span className="truncate">{budget}</span>
              </div>
              <div className="flex flex-col gap-1 text-white/80">
                <div className="flex items-center gap-1.5">
                  <Clock3 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-white/60 text-[10px] uppercase tracking-wider">Time</span>
                </div>
                <span>{duration}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.button>
  )
}
