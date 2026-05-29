import { motion, AnimatePresence } from "framer-motion"

export default function Toast({ message, type = "success", visible, onClose }) {
  if (!visible) return null

  const colors = {
    success: "bg-emerald-500/95 text-white",
    error: "bg-rose-500/95 text-white",
    info: "bg-sky-500/95 text-white",
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.22 }}
          className={`pointer-events-auto fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl px-5 py-4 shadow-2xl ${colors[type] || colors.info}`}
          role="status"
          aria-live="polite"
        >
          <div className="text-sm font-medium">{message}</div>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 inline-flex text-xs uppercase tracking-[0.18em] opacity-80 hover:opacity-100"
          >
            Close
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
