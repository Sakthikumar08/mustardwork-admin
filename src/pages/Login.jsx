import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/auth"
import { Lock, Mail, AlertCircle, Shield } from "lucide-react"
import BackgroundGrid from "../components/BackgroundGrid"
import ThemeToggle from "../components/ThemeToggle"

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
    <div className="min-h-screen bg-app flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg" />
      <BackgroundGrid variant="global" />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-surface/80 backdrop-blur-xl rounded-2xl shadow-soft p-8 sm:p-10 border border-token">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] rounded-2xl mb-4 shadow-soft">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-app mb-2">Admin Portal</h1>
            <p className="text-secondary font-medium">Sign in to access the dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-in slide-in-from-top">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-app mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-2 border border-token rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:border-transparent text-app font-medium transition-all"
                  placeholder="admin@mustardworks.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-app mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-2 border border-token rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:border-transparent text-app font-medium transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-soft"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-surface-2 rounded-xl border border-token">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-[color:var(--primary)] rounded-full animate-pulse" />
              <p className="text-xs text-secondary text-center font-medium">
                Admin access only • Unauthorized attempts are logged
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-secondary">
          © {new Date().getFullYear()} MustardWorks. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
