import api from './api'

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register/', userData)
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/auth/login/', credentials)
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async getProfile() {
    const response = await api.get('/auth/profile/')
    return response.data
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  hasRole(requiredRoles) {
    const user = this.getCurrentUser()
    if (!user || !requiredRoles) return true
    return requiredRoles.includes(user.role)
  }
}