import { useState, useEffect } from "react"
import { projectService } from "../services/projects"
import {
  FolderKanban,
  Search,
  Filter,
  ChevronDown,
  Trash2,
  Eye,
  Calendar,
  User,
  Mail,
  DollarSign,
  Clock as ClockIcon,
} from "lucide-react"

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProject, setSelectedProject] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [statusFilter])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const params = {
        limit: 100,
        sortBy: "submittedAt",
        sortOrder: "desc",
      }

      if (statusFilter !== "all") {
        params.status = statusFilter
      }

      const data = await projectService.getAllProjects(params)
      setProjects(data?.projects || [])
    } catch (error) {
      console.error("[PROJECTS] Failed to load:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await projectService.updateStatus(projectId, newStatus)
      // Reload projects
      loadProjects()
    } catch (error) {
      console.error("[PROJECTS] Failed to update status:", error)
      alert("Failed to update project status")
    }
  }

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await projectService.deleteProject(projectId)
      loadProjects()
    } catch (error) {
      console.error("[PROJECTS] Failed to delete:", error)
      alert("Failed to delete project")
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectType?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-8 h-8" style={{ color: "var(--primary)" }} />
          <div>
            <h1 className="text-3xl font-bold text-app">Project Submissions</h1>
            <p className="text-secondary">{filteredProjects.length} projects found</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl shadow-subtle p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="Search by name, email, or project type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-10 py-2 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-surface rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-2 border-b border-token">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Submitter
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Project Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-token">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-secondary">
                    No projects found
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-app">{project.userName}</div>
                        <div className="text-sm text-secondary">{project.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[color:var(--primary-ghost)]" style={{ color: "var(--primary)" }}>
                        {project.projectType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-app">{project.budget || "N/A"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={project.status}
                        onChange={(e) => handleStatusChange(project._id, e.target.value)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold border border-token bg-surface focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]]"
                        style={{
                          color: getStatusColor(project.status),
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-review">In Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {new Date(project.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProject(project)
                            setShowDetails(true)
                          }}
                          className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-secondary" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Modal */}
      {showDetails && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => {
            setShowDetails(false)
            setSelectedProject(null)
          }}
          onStatusChange={(newStatus) => {
            handleStatusChange(selectedProject._id, newStatus)
            setShowDetails(false)
            setSelectedProject(null)
          }}
        />
      )}
    </div>
  )
}

// Project Details Modal
const ProjectDetailsModal = ({ project, onClose, onStatusChange }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface rounded-2xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-token">
          <h2 className="text-2xl font-bold text-app">Project Details</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField icon={<User className="w-5 h-5" />} label="Name" value={project.userName} />
            <InfoField icon={<Mail className="w-5 h-5" />} label="Email" value={project.email} />
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoField icon={<FolderKanban className="w-5 h-5" />} label="Type" value={project.projectType} />
            <InfoField icon={<DollarSign className="w-5 h-5" />} label="Budget" value={project.budget || "N/A"} />
            <InfoField icon={<ClockIcon className="w-5 h-5" />} label="Timeline" value={project.timeline || "N/A"} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-app mb-2">Description</label>
            <div className="p-4 bg-surface-2 rounded-lg">
              <p className="text-app whitespace-pre-wrap">{project.description}</p>
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-app mb-2">Current Status</label>
              <StatusBadge status={project.status} />
            </div>
            <InfoField
              icon={<Calendar className="w-5 h-5" />}
              label="Submitted"
              value={new Date(project.submittedAt).toLocaleString()}
            />
          </div>

          {/* Update Status */}
          <div>
            <label className="block text-sm font-semibold text-app mb-2">Update Status</label>
            <div className="flex flex-wrap gap-2">
              {["pending", "in-review", "approved", "rejected", "in-progress", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-subtle"
                  style={{
                    backgroundColor: project.status === status ? getStatusColor(status) + "20" : "var(--surface-2)",
                    color: getStatusColor(status),
                    border: `2px solid ${project.status === status ? getStatusColor(status) : "transparent"}`,
                  }}
                >
                  {status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-token flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-surface-2 text-app rounded-lg font-semibold hover:bg-surface border border-token transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Info Field Component
const InfoField = ({ icon, label, value }) => (
  <div>
    <label className="block text-sm font-semibold text-secondary mb-1 flex items-center gap-2">
      <span style={{ color: "var(--primary)" }}>{icon}</span>
      {label}
    </label>
    <p className="text-app font-medium">{value}</p>
  </div>
)

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    pending: { label: "Pending", color: "var(--warning)" },
    "in-review": { label: "In Review", color: "var(--info)" },
    approved: { label: "Approved", color: "var(--success)" },
    rejected: { label: "Rejected", color: "var(--danger)" },
    "in-progress": { label: "In Progress", color: "var(--accent)" },
    completed: { label: "Completed", color: "var(--success)" },
  }[status] || { label: status, color: "var(--secondary)" }

  return (
    <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold" style={{ color: config.color, backgroundColor: config.color + "15" }}>
      {config.label}
    </span>
  )
}

const getStatusColor = (status) => {
  const colors = {
    pending: "var(--warning)",
    "in-review": "var(--info)",
    approved: "var(--success)",
    rejected: "var(--danger)",
    "in-progress": "var(--accent)",
    completed: "var(--success)",
  }
  return colors[status] || "var(--secondary)"
}

export default Projects
