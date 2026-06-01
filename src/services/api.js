import axios from "axios"

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
})

API.interceptors.request.use((config) => {
  try {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("ai-travel-planner-auth") : null
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    }
  } catch (error) {
    // ignore parse errors and continue without auth header
  }
  return config
})

export default API