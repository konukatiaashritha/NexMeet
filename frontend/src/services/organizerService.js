import api from './api'

export const organizerAPI = {
  // Create organizer profile
  async createOrganizer(data) {
    const response = await api.post('/organizers', data)
    return response.data.data
  },

  // Get my organizer profile
  async getMyOrganizer() {
    const response = await api.get('/organizers/me')
    return response.data.data
  },

  // Get my organizer events
  async getMyEvents() {
    const response = await api.get('/organizers/me/events')
    return response.data.data
  },

  // Get analytics
  async getAnalytics() {
    const response = await api.get('/organizers/me/analytics')
    return response.data.data
  },

  // Get registrations for an event
  async getEventRegistrations(eventId) {
    const response = await api.get(`/organizers/me/events/${eventId}/registrations`)
    return response.data.data
  },

  // Get organizer by ID
  async getOrganizer(id) {
    const response = await api.get(`/organizers/${id}`)
    return response.data.data
  },

  // Update organizer profile
  async updateOrganizer(id, data) {
    const response = await api.patch(`/organizers/${id}`, data)
    return response.data.data
  },

  // Add resource to event
  async addResource(eventId, resourceData) {
    const response = await api.post(`/organizers/me/events/${eventId}/resources`, resourceData)
    return response.data.data
  },

  // Upsert certificate info
  async upsertCertificate(eventId, certData) {
    const response = await api.post(`/organizers/me/events/${eventId}/certificate`, certData)
    return response.data.data
  },
}
