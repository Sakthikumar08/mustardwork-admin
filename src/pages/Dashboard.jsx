import { useState, useEffect } from "react"
import { projectService } from "../services/projects"
import { galleryService } from "../services/gallery"
import { 
  LayoutDashboard, 
  FolderKanban, 
  Image, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingProjects: 0,
    approvedProjects: 0,
    rejectedProjects: 0,
    totalGallery: 0,
    activeGallery: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentProjects, setRecentProjects] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all projects and gallery items
      const [projectsData, galleryData] = await Promise.all([
        projectService.getAllProjects({ limit: 5, sortBy: "submittedAt", sortOrder: "desc" }),
        galleryService.getAllItems({ limit: 100 }),
      ])

      const projects = projectsData?.projects || []
      const galleryItems = galleryData?.galleryItems || []

      // Calculate stats
      setStats({
        totalProjects: projects.length,
        pendingProjects: projects.filter((p) => p.status === "pending").length,
        approvedProjects: projects.filter((p) => p.status === "approved" || p.status === "in-progress" || p.status === "completed").length,
        rejectedProjects: projects.filter((p) => p.status === "rejected").length,
        totalGallery: galleryItems.length,
        activeGallery: galleryItems.filter((g) => g.isActive).length,
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
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-8 h-8" style={{ color: "var(--primary)" }} />
        <div>
          <h1 className="text-3xl font-bold text-app">Dashboard</h1>
          <p className="text-secondary">Welcome to MustardWorks Admin</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>

      {/* Recent Projects */}
      <div className="bg-surface rounded-xl shadow-subtle p-6">
        <h2 className="text-xl font-bold text-app mb-4 flex items-center gap-2">
          <FolderKanban className="w-5 h-5" style={{ color: "var(--primary)" }} />
          Recent Project Submissions
        </h2>

        {recentProjects.length === 0 ? (
          <p className="text-secondary text-center py-8">No projects yet</p>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between p-4 bg-surface-2 rounded-lg hover:shadow-subtle transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-app">{project.userName}</h3>
                  <p className="text-sm text-secondary">{project.projectType} • {project.email}</p>
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
    <div className="bg-surface rounded-xl shadow-subtle p-6 hover:shadow-soft transition-all">
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${colorMap[color]}15` }}
        >
          <div style={{ color: colorMap[color] }}>{icon}</div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--success)" }}>
            <TrendingUp className="w-4 h-4" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-app mb-1">{value}</h3>
      <p className="text-sm text-secondary">{title}</p>
    </div>
  )
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: "Pending", color: "var(--warning)", bg: "rgba(245, 158, 11, 0.1)" },
    "in-review": { label: "In Review", color: "var(--info)", bg: "rgba(59, 130, 246, 0.1)" },
    approved: { label: "Approved", color: "var(--success)", bg: "rgba(16, 185, 129, 0.1)" },
    rejected: { label: "Rejected", color: "var(--danger)", bg: "rgba(239, 68, 68, 0.1)" },
    "in-progress": { label: "In Progress", color: "var(--accent)", bg: "rgba(13, 148, 136, 0.1)" },
    completed: { label: "Completed", color: "var(--success)", bg: "rgba(16, 185, 129, 0.1)" },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  )
}

export default Dashboard
