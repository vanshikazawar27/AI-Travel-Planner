import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(80%_80%_at_50%_0%,rgba(170,59,255,0.25),transparent_60%),linear-gradient(180deg,#0b0b10, #141427)] text-white px-6">
      <div className="max-w-xl text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/15 mb-6">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Page not found</h1>
        <p className="text-white/70 mb-6">
          This page doesn’t exist. Use the button below to go back.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

