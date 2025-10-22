import { useState, useEffect } from "react"
import { projectService } from "../services/projects"
import { galleryService } from "../services/gallery"
import { authService } from "../services/auth"
import { 
  LayoutDashboard, 
  FolderKanban, 
  Image, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users
} from "lucide-react"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingProjects: 0,
    approvedProjects: 0,
    rejectedProjects: 0,
    totalGallery: 0,
    activeGallery: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentProjects, setRecentProjects] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all projects, gallery items, and users
      const [projectsData, galleryData, usersData] = await Promise.all([
        projectService.getAllProjects({ limit: 5, sortBy: "submittedAt", sortOrder: "desc" }),
        galleryService.getAllItems({ limit: 100 }),
        authService.getAllUsers({ limit: 1 }).catch(() => ({ users: [], pagination: { totalUsers: 0 } })),
      ])

      const projects = projectsData?.projects || []
      const galleryItems = galleryData?.galleryItems || []
      const totalUsers = usersData?.pagination?.totalUsers || 0

      // Calculate stats
      setStats({
        totalProjects: projects.length,
        pendingProjects: projects.filter((p) => p.status === "pending").length,
        approvedProjects: projects.filter((p) => p.status === "approved" || p.status === "in-progress" || p.status === "completed").length,
        rejectedProjects: projects.filter((p) => p.status === "rejected").length,
        totalGallery: galleryItems.length,
        activeGallery: galleryItems.filter((g) => g.isActive).length,
        totalUsers: totalUsers,
      })

      setRecentProjects(projects.slice(0, 5))
    } catch (error) {
      console.error("[DASHBOARD] Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[color:var(--primary)]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className=" bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] rounded-xl shadow-soft">
            <LayoutDashboard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-app">Dashboard</h1>
            <p className="text-secondary font-medium">Welcome to MustardWorks Admin</p>
          </div>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2.5 bg-surface-2 hover:bg-[color:var(--primary-ghost)] border border-token rounded-xl text-sm font-semibold text-app transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Projects */}
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<FolderKanban className="w-6 h-6" />}
          color="primary"
          trend="+12%"
        />

        {/* Pending Projects */}
        <StatCard
          title="Pending Review"
          value={stats.pendingProjects}
          icon={<Clock className="w-6 h-6" />}
          color="warning"
        />

        {/* Approved Projects */}
        <StatCard
          title="Approved"
          value={stats.approvedProjects}
          icon={<CheckCircle className="w-6 h-6" />}
          color="success"
        />

        {/* Rejected Projects */}
        <StatCard
          title="Rejected"
          value={stats.rejectedProjects}
          icon={<XCircle className="w-6 h-6" />}
          color="danger"
        />

        {/* Total Gallery */}
        <StatCard
          title="Gallery Items"
          value={stats.totalGallery}
          icon={<Image className="w-6 h-6" />}
          color="accent"
        />

        {/* Active Gallery */}
        <StatCard
          title="Active Gallery"
          value={stats.activeGallery}
          icon={<CheckCircle className="w-6 h-6" />}
          color="success"
        />

        {/* Total Users */}
        <StatCard
          title="Registered Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          color="info"
        />
      </div>

      {/* Recent Projects */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-token">
        <h2 className="text-xl font-bold text-app mb-6 flex items-center gap-2">
          <div className="p-2 bg-[color:var(--primary-ghost)] rounded-lg">
            <FolderKanban className="w-5 h-5" style={{ color: "var(--primary)" }} />
          </div>
          Recent Project Submissions
        </h2>

        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-secondary mx-auto mb-3" />
            <p className="text-secondary font-medium">No projects yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface-2/50 rounded-xl hover:shadow-subtle hover:scale-[1.01] transition-all border border-token"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-app mb-1">{project.userName}</h3>
                  <p className="text-sm text-secondary font-medium">
                    {project.projectType} • {project.email}
                  </p>
                </div>
                <StatusBadge status={project.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend }) => {
  const colorMap = {
    primary: "var(--primary)",
    success: "var(--success)",
    danger: "var(--danger)",
    warning: "var(--warning)",
    info: "var(--info)",
    accent: "var(--accent)",
  }

  return (
    <div className="stat-card bg-surface/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-token">
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-3 rounded-xl shadow-subtle"
          style={{ backgroundColor: `${colorMap[color]}20` }}
        >
          <div style={{ color: colorMap[color] }}>{icon}</div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full" style={{ color: "var(--success)", backgroundColor: "var(--success)15" }}>
            <TrendingUp className="w-4 h-4" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-app mb-1">{value}</h3>
      <p className="text-sm text-secondary font-semibold">{title}</p>
    </div>
  )
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: "Pending", color: "var(--warning)", bg: "rgba(245, 158, 11, 0.15)" },
    "in-review": { label: "In Review", color: "var(--info)", bg: "rgba(59, 130, 246, 0.15)" },
    approved: { label: "Approved", color: "var(--success)", bg: "rgba(16, 185, 129, 0.15)" },
    rejected: { label: "Rejected", color: "var(--danger)", bg: "rgba(239, 68, 68, 0.15)" },
    "in-progress": { label: "In Progress", color: "var(--accent)", bg: "rgba(13, 148, 136, 0.15)" },
    completed: { label: "Completed", color: "var(--success)", bg: "rgba(16, 185, 129, 0.15)" },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span
      className="px-4 py-2 rounded-xl text-xs font-bold border"
      style={{ 
        color: config.color, 
        backgroundColor: config.bg,
        borderColor: config.color + "40"
      }}
    >
      {config.label}
    </span>
  )
}

export default Dashboard
