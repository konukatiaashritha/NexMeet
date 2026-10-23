import api from './api'

export const networkingAPI = {
  // Get all accepted connections
  async getConnections() {
    const response = await api.get('/connections')
    return response.data.data
  },

  // Get connection requests (received and sent)
  async getConnectionRequests() {
    const response = await api.get('/connections/requests')
    return response.data.data
  },

  // Send a connection request
  async sendConnectionRequest(userId, message = '') {
    const response = await api.post(`/connections/${userId}`, { message })
    return response.data.data
  },

  // Accept a connection request
  async acceptConnection(connectionId) {
    const response = await api.patch(`/connections/${connectionId}/accept`)
    return response.data.data
  },

  // Reject a connection request
  async rejectConnection(connectionId) {
    const response = await api.patch(`/connections/${connectionId}/reject`)
    return response.data.data
  },

  // Cancel a pending request or remove a connection
  async removeConnection(connectionId) {
    const response = await api.delete(`/connections/${connectionId}`)
    return response.data
  },

  // Get connection status with a specific user
  async getConnectionStatus(userId) {
    const response = await api.get(`/connections/status/${userId}`)
    return response.data.data
  },

  // Get people recommendations
  async getRecommendations(limit = 10) {
    const response = await api.get('/connections/recommendations', { params: { limit } })
    return response.data.data
  },

  // Get people recommendations (alias for networking page)
  async getPeopleRecommendations(limit = 10) {
    const response = await api.get('/networking/recommendations', { params: { limit } })
    return response.data.data
  },
}
