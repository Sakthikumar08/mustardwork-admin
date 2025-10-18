import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/auth"

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser()
          const normalizedUser = userData?.user || userData?.data?.user || userData

          if (normalizedUser?.role === "admin") {
            setIsAdmin(true)
            setIsAuthenticated(true)
          } else {
            // Not an admin
            setIsAdmin(false)
            setIsAuthenticated(false)
            localStorage.removeItem("adminToken")
            navigate("/login", { replace: true })
          }
        } else {
          setIsAuthenticated(false)
          navigate("/login", { replace: true })
        }
      } catch (error) {
        console.error("[PROTECTED ROUTE] Auth check failed:", error)
        setIsAuthenticated(false)
        localStorage.removeItem("adminToken")
        navigate("/login", { replace: true })
      }
    }

    checkAuth()
  }, [navigate])

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-app">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[color:var(--primary)]"></div>
      </div>
    )
  }

  return isAuthenticated && isAdmin ? children : null
}

export default ProtectedRoute
