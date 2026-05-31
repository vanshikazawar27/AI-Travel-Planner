import { motion } from "framer-motion"

export default function GlassCard({
  children,
  className = "",
  hoverLift = true,
}) {
  return (
    <motion.div
      className={`relative rounded-3xl glass-card overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hoverLift
          ? {
              y: -8,
              scale: 1.01,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(217,70,239,0.15)",
              transition: { duration: 0.3, ease: "easeOut" },
            }
          : undefined
      }
    >
      <div className="absolute -inset-1 bg-[radial-gradient(circle_at_30%_10%,rgba(217,70,239,0.15),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(139,92,246,0.15),transparent_55%)] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
      <div className="relative p-0 z-10">{children}</div>
    </motion.div>
  )
}
