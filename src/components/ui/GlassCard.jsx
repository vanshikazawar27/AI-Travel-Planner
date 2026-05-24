import { motion } from "framer-motion"

export default function GlassCard({
  children,
  className = "",
  hoverLift = true,
}) {
  return (
    <motion.div
      className={`relative rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={
        hoverLift
          ? {
              y: -4,
              transition: { duration: 0.2 },
            }
          : undefined
      }
    >
      <div className="absolute -inset-1 bg-[radial-gradient(circle_at_30%_10%,rgba(170,59,255,0.35),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(245,158,11,0.25),transparent_55%)] opacity-60" />
      <div className="relative p-0">{children}</div>
    </motion.div>
  )
}

