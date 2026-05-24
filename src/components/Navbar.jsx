import { Link, NavLink } from "react-router-dom"
import { Compass, Sparkles } from "lucide-react"

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-3">
          <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 ring-1 ring-white/15 overflow-hidden">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(170,59,255,0.8),transparent_55%)] opacity-80" />
            <Sparkles className="relative w-5 h-5 text-yellow-300" />
          </span>
          <span className="text-white font-semibold tracking-wide">
            <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight" style={{fontFamily: "'Outfit', sans-serif"}}>
              AI Travel Planner
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl text-sm font-medium transition border ring-1 ring-transparent ${
                isActive
                  ? "bg-white/10 border-white/15 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5 border-white/0"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/planner"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl text-sm font-medium transition border ring-1 ring-transparent ${
                isActive
                  ? "bg-white/10 border-white/15 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5 border-white/0"
              }`
            }
          >
            <span className="inline-flex items-center gap-2">
              <Compass className="w-4 h-4" /> Planner
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
