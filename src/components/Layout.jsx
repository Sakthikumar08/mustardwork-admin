import { Link, useLocation, useNavigate } from "react-router-dom"
import { authService } from "../services/auth"
import { LayoutDashboard, FolderKanban, Image, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

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
    <div className="min-h-screen bg-app flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-token transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-token">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[color:var(--primary-ghost)] rounded-lg flex items-center justify-center">
                  <span className="font-bold text-lg" style={{ color: "var(--primary)" }}>
                    MW
                  </span>
                </div>
                <div>
                  <h1 className="font-bold text-app">MustardWorks</h1>
                  <p className="text-xs text-secondary">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-surface-2 rounded-lg"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-[color:var(--primary)] text-white shadow-subtle"
                    : "text-secondary hover:bg-surface-2 hover:text-app"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-token">
            <div className="flex items-center gap-3 px-4 py-3 bg-surface-2 rounded-lg mb-3">
              <div className="w-10 h-10 bg-[color:var(--primary-ghost)] rounded-full flex items-center justify-center">
                <span className="font-semibold text-sm" style={{ color: "var(--primary)" }}>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-surface border-b border-token px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-2 rounded-lg"
            >
              <Menu className="w-6 h-6 text-app" />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-surface border-t border-token px-6 py-4">
          <p className="text-sm text-secondary text-center">
            © {new Date().getFullYear()} MustardWorks. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Layout
