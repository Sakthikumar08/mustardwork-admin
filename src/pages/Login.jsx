import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/auth"
import { Lock, Mail, AlertCircle } from "lucide-react"

const Login = ({ setAdmin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("[ADMIN LOGIN] Attempting login")
      const data = await authService.login(formData)

      if (!authService.isAuthenticated()) {
        setError("Login failed. No token received.")
        setLoading(false)
        return
      }

      // Fetch admin profile
      const adminData = await authService.getCurrentUser()
      const normalizedAdmin = adminData?.user || adminData?.data?.user || adminData

      if (normalizedAdmin?.role !== "admin") {
        setError("Access denied. Admin privileges required.")
        localStorage.removeItem("adminToken")
        setLoading(false)
        return
      }

      setAdmin(normalizedAdmin)
      console.log("[ADMIN LOGIN] Login successful")
      navigate("/dashboard", { replace: true })
    } catch (error) {
      console.error("[ADMIN LOGIN] Login error:", error)
      const errorMessage = error.response?.data?.message || error.message || "Login failed"
      setError(errorMessage)
      localStorage.removeItem("adminToken")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-surface rounded-2xl shadow-soft p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[color:var(--primary-ghost)] rounded-full mb-4">
              <Lock className="w-8 h-8" style={{ color: "var(--primary)" }} />
            </div>
            <h1 className="text-3xl font-bold text-app">Admin Login</h1>
            <p className="text-secondary mt-2">Sign in to access the dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-app mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app"
                  placeholder="admin@mustardworks.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-app mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-surface-2 rounded-lg">
            <p className="text-xs text-secondary text-center">
              Admin access only. Unauthorized access attempts are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
