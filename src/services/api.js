import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://mustardworks-backend.onrender.com/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[ADMIN API ERROR]", {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
    })

    if (error.response?.status === 401) {
      console.warn("[ADMIN] 401 Unauthorized - Clearing token")
      localStorage.removeItem("adminToken")

      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api
