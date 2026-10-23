import api from './api'

export const NOTIFICATION_TYPES = {
  REGISTRATION_CONFIRMED: 'REGISTRATION_CONFIRMED',
  EVENT_REMINDER: 'EVENT_REMINDER',
  CONNECTION_REQUEST: 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED: 'CONNECTION_ACCEPTED',
  EVENT_UPDATED: 'EVENT_UPDATED',
  EVENT_CANCELLED: 'EVENT_CANCELLED',
  COMMUNITY_UPDATE: 'COMMUNITY_UPDATE',
  RECOMMENDATION: 'RECOMMENDATION',
  REVIEW_REMINDER: 'REVIEW_REMINDER',
  REGISTRATION_CLOSING: 'REGISTRATION_CLOSING',
}

export const NOTIFICATION_META = {
  REGISTRATION_CONFIRMED: { emoji: '✅', label: 'Registration', color: 'text-green-600', bg: 'bg-green-50' },
  EVENT_REMINDER: { emoji: '⏰', label: 'Reminder', color: 'text-blue-600', bg: 'bg-blue-50' },
  CONNECTION_REQUEST: { emoji: '🤝', label: 'Connection', color: 'text-purple-600', bg: 'bg-purple-50' },
  CONNECTION_ACCEPTED: { emoji: '🎉', label: 'Connection', color: 'text-purple-600', bg: 'bg-purple-50' },
  EVENT_UPDATED: { emoji: '📝', label: 'Update', color: 'text-orange-600', bg: 'bg-orange-50' },
  EVENT_CANCELLED: { emoji: '❌', label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
  COMMUNITY_UPDATE: { emoji: '💬', label: 'Community', color: 'text-teal-600', bg: 'bg-teal-50' },
  RECOMMENDATION: { emoji: '✨', label: 'For You', color: 'text-primary-600', bg: 'bg-primary-50' },
  REVIEW_REMINDER: { emoji: '⭐', label: 'Review', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  REGISTRATION_CLOSING: { emoji: '⚠️', label: 'Deadline', color: 'text-red-600', bg: 'bg-red-50' },
}

export const notificationAPI = {
  // Get notifications
  async getNotifications(params = {}) {
    const response = await api.get('/notifications', { params })
    return response.data
  },

  // Get unread count
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count')
    return response.data.data.count
  },

  // Mark a notification as read
  async markAsRead(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/read`)
    return response.data
  },

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all')
    return response.data
  },
}
