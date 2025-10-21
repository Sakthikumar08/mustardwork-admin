import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { authService } from "./services/auth"
import { ThemeProvider } from "./context/ThemeContext"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import GalleryManagement from "./pages/GalleryManagement"
import "./App.css"

function App() {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[ADMIN APP] Checking authentication")
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser()
          const normalizedAdmin = userData?.user || userData?.data?.user || userData

          if (normalizedAdmin?.role === "admin") {
            setAdmin(normalizedAdmin)
            console.log("[ADMIN APP] Admin authenticated:", normalizedAdmin.email)
          } else {
            console.warn("[ADMIN APP] User is not admin")
            localStorage.removeItem("adminToken")
            setAdmin(null)
          }
        }
      } catch (error) {
        console.error("[ADMIN APP] Auth check failed:", error)
        localStorage.removeItem("adminToken")
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-app">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[color:var(--primary)]"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setAdmin={setAdmin} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout admin={admin}>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout admin={admin}>
                  <Projects />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Layout admin={admin}>
                  <GalleryManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
