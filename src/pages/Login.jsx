import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

import Navbar from "../components/Navbar"
import GlassCard from "../components/ui/GlassCard"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await API.post("/auth/login", formData)
      const { token, user } = response.data
      login(token, user)
      navigate("/planner")
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(170,59,255,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_10%,rgba(245,158,11,0.22),transparent_55%),linear-gradient(180deg,#0b0b10,#141427)] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <GlassCard>
          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                <ShieldCheck className="w-4 h-4 text-yellow-300" />
                Secure login
              </div>
              <h1 className="mt-6 text-3xl font-bold">Welcome back</h1>
              <p className="mt-2 text-white/70">Sign in to save your trips and manage itineraries.</p>
            </div>

            {error && <div className="mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-yellow-300 focus:ring-4 focus:ring-yellow-300/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-yellow-300 focus:ring-4 focus:ring-yellow-300/10"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-white/70">
              Don’t have an account?{' '}
              <Link to="/register" className="font-semibold text-yellow-300 hover:text-yellow-200">
                Create one
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default Login
