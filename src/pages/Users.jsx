import { useState, useEffect } from "react"
import { authService } from "../services/auth"
import { Users as UsersIcon, Search, Filter, UserCheck, Mail, Calendar, Shield } from "lucide-react"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  })

  useEffect(() => {
    loadUsers()
  }, [roleFilter])

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      }

      if (roleFilter !== "all") {
        params.role = roleFilter
      }

      const data = await authService.getAllUsers(params)
      setUsers(data?.users || [])
      setPagination(data?.pagination || { currentPage: 1, totalPages: 1, totalUsers: 0 })
    } catch (error) {
      console.error("[USERS] Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.name?.toLowerCase().includes(searchLower)
    )
  })

  const stats = {
    total: pagination.totalUsers,
    admins: users.filter((u) => u.role === "admin").length,
    regularUsers: users.filter((u) => u.role === "user").length,
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
          <div className="p-2 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] rounded-xl shadow-soft">
            <UsersIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-app">Registered Users</h1>
            <p className="text-secondary font-medium">{pagination.totalUsers} total users</p>
          </div>
        </div>
        <button
          onClick={() => loadUsers(pagination.currentPage)}
          className="px-4 py-2.5 bg-surface-2 hover:bg-[color:var(--primary-ghost)] border border-token rounded-xl text-sm font-semibold text-app transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface/80 backdrop-blur-sm rounded-xl shadow-soft p-6 border border-token">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold text-app">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-surface/80 backdrop-blur-sm rounded-xl shadow-soft p-6 border border-token">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Admins</p>
              <p className="text-3xl font-bold text-app">{stats.admins}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-surface/80 backdrop-blur-sm rounded-xl shadow-soft p-6 border border-token">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary font-medium mb-1">Regular Users</p>
              <p className="text-3xl font-bold text-app">{stats.regularUsers}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-xl shadow-soft p-4 border border-token">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-2 border border-token rounded-lg text-app placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 bg-surface-2 border border-token rounded-lg text-app focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
            >
              <option value="all">All Roles</option>
              <option value="user">Users Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface/80 backdrop-blur-sm rounded-xl shadow-soft border border-token overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-2 border-b border-token">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-app">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-app">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-app">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-app">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-token">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <UsersIcon className="w-12 h-12 text-secondary mx-auto mb-3" />
                    <p className="text-secondary font-medium">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] flex items-center justify-center text-white font-bold shadow-sm">
                          {user.firstName?.[0] || "U"}
                          {user.lastName?.[0] || ""}
                        </div>
                        <div>
                          <p className="font-semibold text-app">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-secondary">ID: {user._id?.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-secondary" />
                        <span className="text-app">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Shield className="w-3.5 h-3.5" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" />
                        )}
                        {user.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-surface-2 border-t border-token flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => loadUsers(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 bg-surface hover:bg-surface-2 border border-token rounded-lg text-sm font-medium text-app disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => loadUsers(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 bg-surface hover:bg-surface-2 border border-token rounded-lg text-sm font-medium text-app disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
