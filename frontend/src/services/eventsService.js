import api from './api'

export const eventsAPI = {
  // Get all events with filters
  async getEvents(params = {}) {
    const response = await api.get('/events', { params })
    return response.data
  },

  // Get single event
  async getEvent(id) {
    const response = await api.get(`/events/${id}`)
    return response.data
  },

  // Create new event (organizers only)
  async createEvent(eventData) {
    const response = await api.post('/events', eventData)
    return response.data
  },

  // Update event
  async updateEvent(id, eventData) {
    const response = await api.put(`/events/${id}`, eventData)
    return response.data
  },

  // Delete event
  async deleteEvent(id) {
    await api.delete(`/events/${id}`)
  },

  // Register for event
  async registerForEvent(eventId) {
    const response = await api.post(`/events/${eventId}/register`)
    return response.data
  },

  // Cancel event registration
  async cancelRegistration(eventId) {
    await api.delete(`/events/${eventId}/register`)
  },

  // Save/bookmark event
  async saveEvent(eventId) {
    const response = await api.post(`/events/${eventId}/save`)
    return response.data
  },

  // Unsave event
  async unsaveEvent(eventId) {
    await api.delete(`/events/${eventId}/save`)
  },

  // Get user's saved events
  async getSavedEvents() {
    const response = await api.get('/events/saved')
    return response.data
  },

  // Get user's registered events
  async getRegisteredEvents() {
    const response = await api.get('/events/registered')
    return response.data
  },

  // Search events
  async searchEvents(query, filters = {}) {
    const params = { q: query, ...filters }
    const response = await api.get('/search/events', { params })
    return response.data
  },

  // Get event attendees
  async getEventAttendees(eventId) {
    const response = await api.get(`/events/${eventId}/attendees`)
    return response.data
  },
}