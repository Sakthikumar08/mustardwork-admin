import { useState, useEffect } from "react"
import { galleryService } from "../services/gallery"
import { Image, Plus, Edit2, Trash2, Eye, EyeOff, Search, Filter } from "lucide-react"

const GalleryManagement = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      setLoading(true)
      const data = await galleryService.getAllItems({ limit: 100 })
      setItems(data?.galleryItems || [])
    } catch (error) {
      console.error("[GALLERY] Failed to load:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return

    try {
      await galleryService.deleteItem(id)
      loadGallery()
    } catch (error) {
      console.error("[GALLERY] Failed to delete:", error)
      alert("Failed to delete gallery item")
    }
  }

  const handleToggleActive = async (item) => {
    try {
      await galleryService.updateItem(item._id, { isActive: !item.isActive })
      loadGallery()
    } catch (error) {
      console.error("[GALLERY] Failed to toggle active:", error)
      alert("Failed to update gallery item")
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || item.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesCategory
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
          <Image className="w-8 h-8" style={{ color: "var(--primary)" }} />
          <div>
            <h1 className="text-3xl font-bold text-app">Gallery Management</h1>
            <p className="text-secondary">{filteredItems.length} items</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            setShowForm(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl shadow-subtle p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="Search gallery items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-10 py-2 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Categories</option>
              <option value="iot">IoT</option>
              <option value="e-vehicles">E-Vehicles</option>
              <option value="ai">AI</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="vlsi">VLSI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-secondary">No gallery items found</div>
        ) : (
          filteredItems.map((item) => (
            <GalleryCard
              key={item._id}
              item={item}
              onEdit={() => {
                setEditingItem(item)
                setShowForm(true)
              }}
              onDelete={() => handleDelete(item._id)}
              onToggleActive={() => handleToggleActive(item)}
            />
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <GalleryForm
          item={editingItem}
          onClose={() => {
            setShowForm(false)
            setEditingItem(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setEditingItem(null)
            loadGallery()
          }}
        />
      )}
    </div>
  )
}

// Gallery Card Component
const GalleryCard = ({ item, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className="bg-surface rounded-xl shadow-subtle overflow-hidden hover:shadow-soft transition-all group">
      <div className="relative aspect-square">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" onError={(e) => (e.target.src = "/placeholder.svg?height=400&width=400")} />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
          <button onClick={onEdit} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
            <Edit2 className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={onToggleActive} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors" title={item.isActive ? "Deactivate" : "Activate"}>
            {item.isActive ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-gray-600" />}
          </button>
          <button onClick={onDelete} className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Delete">
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
        {!item.isActive && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">Inactive</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-app truncate">{item.title}</h3>
          <span className="px-2 py-1 bg-[color:var(--primary-ghost)] text-xs font-semibold rounded" style={{ color: "var(--primary)" }}>
            {item.category}
          </span>
        </div>
        <p className="text-sm text-secondary line-clamp-2">{item.description}</p>
      </div>
    </div>
  )
}

// Gallery Form Component
const GalleryForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    category: item?.category || "iot",
    image: item?.image || "",
    isActive: item?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (item) {
        await galleryService.updateItem(item._id, formData)
      } else {
        await galleryService.createItem(formData)
      }
      onSuccess()
    } catch (error) {
      console.error("[GALLERY FORM] Submit error:", error)
      setError(error.response?.data?.message || "Failed to save gallery item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface rounded-2xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-token">
          <h2 className="text-2xl font-bold text-app">{item ? "Edit Gallery Item" : "Add New Gallery Item"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-app mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-2 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-app mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app resize-none"
              placeholder="Enter description"
            />
            <p className="text-xs text-secondary mt-1">{formData.description.length}/500 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-app mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app"
            >
              <option value="iot">IoT</option>
              <option value="e-vehicles">E-Vehicles</option>
              <option value="ai">AI</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="vlsi">VLSI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-app mb-2">Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-surface border border-token rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-app"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-3">
                <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" onError={(e) => (e.target.src = "/placeholder.svg?height=200&width=400")} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-token focus:ring-2 focus:ring-[color:var(--primary)]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-app">
              Active (visible on public gallery)
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-token">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 bg-surface-2 text-app rounded-lg font-semibold hover:bg-surface border border-token transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Saving..." : item ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GalleryManagement
