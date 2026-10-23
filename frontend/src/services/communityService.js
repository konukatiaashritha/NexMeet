import api from './api'

export const POST_TYPES = {
  ANNOUNCEMENT: 'announcement',
  DISCUSSION: 'discussion',
  QUESTION: 'question',
  INTRODUCTION: 'introduction',
  RESOURCE: 'resource',
}

export const POST_TYPE_META = {
  announcement: {
    emoji: '📢',
    label: 'Announcement',
    color: 'bg-amber-100 text-amber-700',
  },
  discussion: {
    emoji: '💬',
    label: 'Discussion',
    color: 'bg-blue-100 text-blue-700',
  },
  question: {
    emoji: '❓',
    label: 'Question',
    color: 'bg-violet-100 text-violet-700',
  },
  introduction: {
    emoji: '👋',
    label: 'Introduction',
    color: 'bg-emerald-100 text-emerald-700',
  },
  resource: {
    emoji: '📎',
    label: 'Resource',
    color: 'bg-sky-100 text-sky-700',
  },
}

export const communityAPI = {
  // Get all communities
  async getAllCommunities(params = {}) {
    const response = await api.get('/communities', { params })
    return response.data.data || response.data
  },

  async getCommunities(params = {}) {
    return this.getAllCommunities(params)
  },

  // Get community for an event
  async getCommunity(eventId) {
    const response = await api.get(`/events/${eventId}/community`)
    return response.data.data || response.data
  },

  async getCommunityByEvent(eventId) {
    return this.getCommunity(eventId)
  },

  // Get community posts for an event
  async getCommunityPosts(eventId, params = {}) {
    const response = await api.get(`/events/${eventId}/community/posts`, { params })
    return response.data.data || response.data
  },

  async getPosts(communityId, params = {}) {
    const response = await api.get(`/communities/${communityId}/posts`, { params })
    return response.data.data || response.data
  },

  // Create a post in an event community
  async createPost(communityId, payload) {
    const response = await api.post(`/communities/${communityId}/posts`, payload)
    return response.data.data || response.data
  },

  // Join / leave community
  async joinCommunity(communityId) {
    const response = await api.post(`/communities/${communityId}/join`)
    return response.data.data || response.data
  },

  async leaveCommunity(communityId) {
    const response = await api.delete(`/communities/${communityId}/join`)
    return response.data.data || response.data
  },

  // Update a post
  async updatePost(postId, content) {
    const response = await api.patch(`/posts/${postId}`, { content })
    return response.data.data || response.data
  },

  // Delete a post
  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`)
    return response.data
  },

  // Create a comment on a post
  async createComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content })
    return response.data.data || response.data
  },

  // Delete a comment
  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  },
}
