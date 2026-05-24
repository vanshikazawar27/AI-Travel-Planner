import { motion } from "framer-motion"

export default function Spinner({ className = "" }) {
  return (
    <motion.span
      aria-label="Loading"
      className={`inline-block ${className}`}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      style={{ borderTopColor: "transparent" }}
    >
      <span
        className="block w-6 h-6 rounded-full border-2 border-yellow-300 border-t-transparent"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />
    </motion.span>
  )
}

