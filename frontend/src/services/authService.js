import api from './api'

// Mock user for testing
const mockUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  college_company: 'Tech University',
  location: 'San Francisco, CA',
  bio: 'Software developer passionate about AI and machine learning',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
  interests: ['AI/ML', 'Web Development', 'Startups', 'Networking'],
  career_field: 'technology',
  experience_level: 'mid',
  networking_goals: ['learn', 'collaborate', 'network'],
  profile_picture: null,
  is_verified: true,
  created_at: '2024-01-01T00:00:00.000Z'
}

export const authAPI = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      console.log('API not available, using mock login')
      // Simple mock validation
      if (email && password) {
        return {
          user: mockUser,
          token: 'mock-jwt-token-12345'
        }
      } else {
        throw new Error('Invalid credentials')
      }
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      console.log('API not available, using mock registration')
      return {
        user: {
          ...mockUser,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          college_company: userData.college_company,
          location: userData.location
        },
        token: 'mock-jwt-token-12345'
      }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      console.log('API not available, using mock user data')
      return mockUser
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/users/profile', userData)
      return response.data
    } catch (error) {
      console.log('API not available, simulating profile update')
      return { ...mockUser, ...userData }
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.log('API not available, simulating logout')
    }
  },
}