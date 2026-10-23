import api from './api'

export const eventsAPI = {
  // Get all events with filters & pagination
  async getEvents(params = {}) {
    const response = await api.get('/events', { params })
    return response.data
  },

  // Get single event
  async getEvent(id) {
    const response = await api.get(`/events/${id}`)
    return response.data.data
  },

  // Create new event (organizers only)
  async createEvent(eventData) {
    const response = await api.post('/events', eventData)
    return response.data.data
  },

  // Update event
  async updateEvent(id, eventData) {
    const response = await api.patch(`/events/${id}`, eventData)
    return response.data.data
  },

  // Publish event
  async publishEvent(id) {
    const response = await api.post(`/events/${id}/publish`)
    return response.data.data
  },

  // Delete/archive event
  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`)
    return response.data
  },

  // Register for event
  async registerForEvent(eventId) {
    const response = await api.post(`/events/${eventId}/register`)
    return response.data.data
  },

  // Cancel event registration
  async cancelRegistration(eventId) {
    const response = await api.delete(`/events/${eventId}/register`)
    return response.data
  },

  // Get registration status
  async getRegistrationStatus(eventId) {
    const response = await api.get(`/events/${eventId}/registration`)
    return response.data.data
  },

  // Save/bookmark event
  async saveEvent(eventId) {
    const response = await api.post(`/events/${eventId}/save`)
    return response.data
  },

  // Unsave event
  async unsaveEvent(eventId) {
    const response = await api.delete(`/events/${eventId}/save`)
    return response.data
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

  // Get event attendees
  async getEventAttendees(eventId) {
    const response = await api.get(`/events/${eventId}/attendees`)
    return response.data.data
  },

  // Get event reviews
  async getEventReviews(eventId) {
    const response = await api.get(`/events/${eventId}/reviews`)
    return response.data.data
  },

  // Create a review
  async createReview(eventId, reviewData) {
    const response = await api.post(`/events/${eventId}/reviews`, reviewData)
    return response.data.data
  },

  // Update a review
  async updateReview(reviewId, reviewData) {
    const response = await api.patch(`/reviews/${reviewId}`, reviewData)
    return response.data.data
  },

  // Delete a review
  async deleteReview(reviewId) {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data
  },
}
