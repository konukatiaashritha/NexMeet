import api from './api'

export const authAPI = {
  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data.data
  },

  // Register user
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data.data
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  // Update user profile
  async updateProfile(userData) {
    const response = await api.patch('/users/me', userData)
    return response.data.data
  },

  // Update privacy settings
  async updatePrivacy(privacyData) {
    const response = await api.patch('/users/me/privacy', privacyData)
    return response.data.data
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore errors on logout
    }
  },
}
