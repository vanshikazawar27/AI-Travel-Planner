import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { Compass, Sparkles, User, LogOut, Bookmark } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full glass-nav shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 px-2 py-2">
      <div className="flex items-center justify-between px-2 sm:px-4">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-black/50 border border-white/10 overflow-hidden shadow-[0_0_15px_rgba(217,70,239,0.2)] group-hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all duration-300">
            <span className="absolute inset-0 bg-gradient-neon opacity-20 group-hover:opacity-40 transition-opacity" />
            <Sparkles className="relative w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:block text-white font-extrabold tracking-wide text-lg drop-shadow-md">
            WanderGo
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { to: "/", label: "Home", exact: true },
            { to: "/planner", label: "Planner", icon: Compass },
            ...(isAuthenticated ? [{ to: "/my-trips", label: "Trips", icon: Bookmark }] : [])
          ].map((item) => {
            const isActive = item.exact ? location.pathname === "/" : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 border border-white/20 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition-all hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-neon px-5 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all duration-300 hover:scale-105"
            >
              <User className="w-4 h-4" /> <span className="hidden sm:inline">Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
