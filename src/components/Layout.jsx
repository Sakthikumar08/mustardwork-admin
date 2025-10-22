import { Link, useLocation, useNavigate } from "react-router-dom"
import { authService } from "../services/auth"
import { LayoutDashboard, FolderKanban, Image, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import ThemeToggle from "./ThemeToggle"
import BackgroundGrid from "./BackgroundGrid"

const Layout = ({ children, admin }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate("/login", { replace: true })
    } catch (error) {
      console.error("[LAYOUT] Logout error:", error)
      navigate("/login", { replace: true })
    }
  }

  const menuItems = [
    { path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { path: "/projects", icon: <FolderKanban className="w-5 h-5" />, label: "Projects" },
    { path: "/gallery", icon: <Image className="w-5 h-5" />, label: "Gallery" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-app flex relative">
      {/* Animated Background */}
      <div className="animated-bg" />
      <BackgroundGrid variant="global" />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-surface/80 backdrop-blur-xl border-r border-token transform transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo */}
          <div className="p-6 border-b border-token">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center ">
    <img 
      src="/logo.png" 
      alt="Logo"
      className="w-60 h-12 object-contain"
    />
  
  <div className="text-center">
    <h1 className="font-bold text-lg text-app">Admin Panel</h1>
    <p className="text-xs text-secondary font-medium mt-1">MustardWorks</p>
  </div>
</div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-surface-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] text-white shadow-soft scale-[1.02]"
                    : "text-secondary hover:bg-surface-2 hover:text-app hover:scale-[1.02]"
                }`}
              >
                <span className={isActive(item.path) ? "" : "group-hover:scale-110 transition-transform"}>
                  {item.icon}
                </span>
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-token space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 bg-surface-2 rounded-xl">
              <div className="w-11 h-11 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] rounded-full flex items-center justify-center shadow-subtle">
                <span className="font-bold text-sm text-white">
                  {admin?.firstName?.[0]}{admin?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-app text-sm truncate">
                  {admin?.firstName} {admin?.lastName}
                </p>
                <p className="text-xs text-secondary truncate">{admin?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-semibold border border-red-200 dark:border-red-800"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Top Bar */}
        <header className="bg-surface/60 backdrop-blur-xl border-b border-token px-4 sm:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 hover:bg-surface-2 rounded-xl transition-colors border border-token"
            >
              <Menu className="w-6 h-6 text-app" />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-secondary">System Online</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-secondary font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto relative">{children}</main>

        {/* Footer */}
        <footer className="bg-surface/60 backdrop-blur-xl border-t border-token px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-secondary text-center">
              © {new Date().getFullYear()} MustardWorks. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-secondary">
              <span className="w-2 h-2 bg-[color:var(--primary)] rounded-full" />
              <span className="font-medium">Admin v1.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Layout
