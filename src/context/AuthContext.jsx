import { createContext, useContext, useEffect, useMemo, useState } from "react"
import API from "../services/api"

const AUTH_STORAGE_KEY = "ai-travel-planner-auth"
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_STORAGE_KEY) : null
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed?.token && parsed?.user) {
          setToken(parsed.token)
          setUser(parsed.user)
        }
      } catch (error) {
        console.warn("Failed to parse auth storage", error)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (token) {
      API.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete API.defaults.headers.common.Authorization
    }
  }, [token])

  const login = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }))
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  const value = useMemo(
    () => ({ user, token, loading, login, logout, isAuthenticated: Boolean(user) }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
