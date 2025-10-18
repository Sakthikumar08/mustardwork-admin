import api from "./api"

export const projectService = {
  // Get all projects (admin)
  getAllProjects: async (params = {}) => {
    try {
      console.log("[PROJECT SERVICE] Fetching projects:", params)
      const response = await api.get("/projects", { params })
      const data = response?.data || response

      console.log("[PROJECT SERVICE] Projects response:", {
        success: data?.success,
        count: data?.data?.projects?.length || 0,
      })

      return data?.data || data
    } catch (error) {
      console.error("[PROJECT SERVICE] Failed to fetch projects:", error.message)
      throw error
    }
  },

  // Update project status
  updateStatus: async (id, status) => {
    try {
      console.log("[PROJECT SERVICE] Updating project status:", { id, status })
      const response = await api.patch(`/projects/${id}/status`, { status })
      const data = response?.data || response
      return data?.data?.project || data?.project || data
    } catch (error) {
      console.error("[PROJECT SERVICE] Failed to update status:", error.message)
      throw error
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      console.log("[PROJECT SERVICE] Deleting project:", id)
      const response = await api.delete(`/projects/${id}`)
      return response?.data || response
    } catch (error) {
      console.error("[PROJECT SERVICE] Failed to delete project:", error.message)
      throw error
    }
  },
}

export default projectService
