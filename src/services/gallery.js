import api from "./api"

export const galleryService = {
  // Get all gallery items (admin - includes inactive)
  getAllItems: async (params = {}) => {
    try {
      console.log("[GALLERY SERVICE] Fetching all gallery items:", params)
      const response = await api.get("/gallery/admin/all", { params })
      const data = response?.data || response

      console.log("[GALLERY SERVICE] Gallery response:", {
        success: data?.success,
        count: data?.data?.galleryItems?.length || 0,
      })

      return data?.data || data
    } catch (error) {
      console.error("[GALLERY SERVICE] Failed to fetch items:", error.message)
      throw error
    }
  },

  // Create gallery item
  createItem: async (itemData) => {
    try {
      console.log("[GALLERY SERVICE] Creating gallery item")
      const response = await api.post("/gallery", itemData)
      const data = response?.data || response
      return data?.data?.galleryItem || data?.galleryItem || data
    } catch (error) {
      console.error("[GALLERY SERVICE] Failed to create item:", error.message)
      throw error
    }
  },

  // Update gallery item
  updateItem: async (id, itemData) => {
    try {
      console.log("[GALLERY SERVICE] Updating gallery item:", id)
      const response = await api.patch(`/gallery/${id}`, itemData)
      const data = response?.data || response
      return data?.data?.galleryItem || data?.galleryItem || data
    } catch (error) {
      console.error("[GALLERY SERVICE] Failed to update item:", error.message)
      throw error
    }
  },

  // Delete gallery item
  deleteItem: async (id) => {
    try {
      console.log("[GALLERY SERVICE] Deleting gallery item:", id)
      const response = await api.delete(`/gallery/${id}`)
      return response?.data || response
    } catch (error) {
      console.error("[GALLERY SERVICE] Failed to delete item:", error.message)
      throw error
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await api.get("/gallery/categories")
      const data = response?.data || response
      return data?.data?.categories || data?.categories || []
    } catch (error) {
      console.error("[GALLERY SERVICE] Failed to fetch categories:", error.message)
      throw error
    }
  },
}

export default galleryService