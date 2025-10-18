import api from "./api"

export const authService = {
  // Admin login
  login: async (credentials) => {
    try {
      console.log("[ADMIN AUTH] Logging in:", { email: credentials.email })
      const response = await api.post("/auth/admin/login", credentials)
      const data = response?.data || response

      console.log("[ADMIN AUTH] Login response:", {
        success: data?.success,
        hasToken: !!data?.token,
      })

      const token = data?.token || data?.accessToken || data?.data?.token

      if (token) {
        localStorage.setItem("adminToken", token)
        console.log("[ADMIN AUTH] Token stored")
      } else {
        console.error("[ADMIN AUTH] No token in response")
      }

      return data
    } catch (error) {
      console.error("[ADMIN AUTH] Login failed:", error.response?.data || error.message)
      throw error
    }
  },

  // Get current admin user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me")
      const data = response?.data || response
      return data?.user || data?.data?.user || data
    } catch (error) {
      console.error("[ADMIN AUTH] getCurrentUser failed:", error.message)
      throw error
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout")
      localStorage.removeItem("adminToken")
    } catch (error) {
      localStorage.removeItem("adminToken")
      throw error
    }
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("adminToken")
  },

  getToken: () => {
    return localStorage.getItem("adminToken")
  },
}

export default authService
