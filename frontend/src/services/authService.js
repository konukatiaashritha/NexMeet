import api from './api'

export const authAPI = {
  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  // Register user
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Update user profile
  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData)
    return response.data
  },

  // Logout user
  async logout() {
    await api.post('/auth/logout')
  },
}