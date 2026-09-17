import api from './api'

// Mock events data for testing (since no backend is running)
const mockEvents = [
  {
    id: 1,
    title: 'AI/ML Workshop for Beginners',
    description: 'Learn the fundamentals of Artificial Intelligence and Machine Learning with hands-on exercises.',
    category: 'workshop',
    organizer_name: 'Google',
    start_date: '2024-12-15',
    start_time: '14:00',
    location: 'Google Campus, Mountain View',
    is_online: false,
    capacity: 100,
    registered_count: 75,
    registration_deadline: '2024-12-10',
    price: 0,
    level: 'beginner',
    certificate: {
      available: true,
      issued_by: 'Google',
      certificate_type: 'completion',
      skills_covered: ['Machine Learning', 'Python', 'Data Analysis'],
      eligibility_requirements: 'Attend the full workshop and complete the assessment',
      cost_type: 'free',
      delivery_method: 'after_assessment',
      certificate_link: 'https://developers.google.com/certification',
      additional_info: 'Certificate will be sent via email within 5 business days'
    }
  },
  {
    id: 2,
    title: 'React Developer Meetup',
    description: 'Monthly meetup for React developers to share knowledge and network.',
    category: 'meetup',
    organizer_name: 'React Community',
    start_date: '2024-12-20',
    start_time: '18:30',
    location: 'Tech Hub Downtown',
    is_online: false,
    capacity: 50,
    registered_count: 32,
    registration_deadline: '2024-12-18',
    price: 0,
    level: 'intermediate'
    // No certificate for this event
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    description: 'Present your startup idea to investors and win prizes.',
    category: 'startup',
    organizer_name: 'Startup Incubator',
    start_date: '2024-12-25',
    start_time: '10:00',
    location: 'Innovation Center',
    is_online: false,
    capacity: 200,
    registered_count: 150,
    registration_deadline: '2024-12-22',
    price: 25,
    level: 'advanced',
    certificate: {
      available: true,
      issued_by: 'Startup Incubator',
      certificate_type: 'participation',
      skills_covered: ['Entrepreneurship', 'Pitching', 'Business Development'],
      eligibility_requirements: 'Present your pitch and participate in Q&A',
      cost_type: 'free',
      delivery_method: 'after_attending',
      additional_info: 'All participants receive a certificate'
    }
  },
  {
    id: 4,
    title: 'Data Science Bootcamp',
    description: 'Intensive 3-day bootcamp covering data science fundamentals.',
    category: 'workshop',
    organizer_name: 'Stanford University',
    start_date: '2025-01-05',
    start_time: '09:00',
    location: 'Stanford Campus',
    is_online: true,
    capacity: 30,
    registered_count: 25,
    registration_deadline: '2024-12-30',
    price: 150,
    level: 'intermediate',
    certificate: {
      available: true,
      issued_by: 'Stanford University',
      certificate_type: 'achievement',
      skills_covered: ['Data Science', 'Statistics', 'Python', 'R Programming'],
      eligibility_requirements: 'Complete all assignments and pass final evaluation with 80% score',
      cost_type: 'paid',
      cost_amount: 50,
      delivery_method: 'after_requirements',
      certificate_link: 'https://online.stanford.edu/certificates',
      additional_info: 'Official Stanford continuing education certificate'
    }
  },
  {
    id: 5,
    title: 'Tech Conference 2024',
    description: 'Annual technology conference with industry leaders.',
    category: 'conference',
    organizer_name: 'Tech Events Inc',
    start_date: '2024-11-10',  // Past event
    start_time: '08:00',
    location: 'Convention Center',
    is_online: false,
    capacity: 500,
    registered_count: 500,
    registration_deadline: '2024-11-05',
    price: 0,
    level: 'all',
    certificate: {
      available: true,
      issued_by: 'Tech Events Inc',
      certificate_type: 'participation',
      skills_covered: ['Technology Trends', 'Networking', 'Leadership'],
      eligibility_requirements: 'Attend at least 50% of the sessions',
      cost_type: 'free',
      delivery_method: 'automatic',
      additional_info: 'Certificate available in your event dashboard'
    }
  }
]

export const eventsAPI = {
  // Get all events with filters
  async getEvents(params = {}) {
    try {
      const response = await api.get('/events', { params })
      return response.data
    } catch (error) {
      // Fallback to mock data when API is not available
      console.log('API not available, using mock data')
      return {
        events: mockEvents,
        total: mockEvents.length
      }
    }
  },

  // Get single event
  async getEvent(id) {
    try {
      const response = await api.get(`/events/${id}`)
      return response.data
    } catch (error) {
      // Fallback to mock data when API is not available
      console.log('API not available, using mock data')
      const event = mockEvents.find(e => e.id === parseInt(id))
      if (!event) {
        throw new Error('Event not found')
      }
      return event
    }
  },

  // Create new event (organizers only)
  async createEvent(eventData) {
    try {
      const response = await api.post('/events', eventData)
      return response.data
    } catch (error) {
      console.log('API not available, simulating event creation')
      return { success: true, message: 'Event created successfully' }
    }
  },

  // Update event
  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/events/${id}`, eventData)
      return response.data
    } catch (error) {
      console.log('API not available, simulating event update')
      return { success: true, message: 'Event updated successfully' }
    }
  },

  // Delete event
  async deleteEvent(id) {
    try {
      await api.delete(`/events/${id}`)
    } catch (error) {
      console.log('API not available, simulating event deletion')
    }
  },

  // Register for event
  async registerForEvent(eventId) {
    try {
      const response = await api.post(`/events/${eventId}/register`)
      return response.data
    } catch (error) {
      console.log('API not available, simulating event registration')
      return { success: true, message: 'Registered successfully' }
    }
  },

  // Cancel event registration
  async cancelRegistration(eventId) {
    try {
      await api.delete(`/events/${eventId}/register`)
    } catch (error) {
      console.log('API not available, simulating registration cancellation')
    }
  },

  // Save/bookmark event
  async saveEvent(eventId) {
    try {
      const response = await api.post(`/events/${eventId}/save`)
      return response.data
    } catch (error) {
      console.log('API not available, simulating event save')
      return { success: true, message: 'Event saved' }
    }
  },

  // Unsave event
  async unsaveEvent(eventId) {
    try {
      await api.delete(`/events/${eventId}/save`)
    } catch (error) {
      console.log('API not available, simulating event unsave')
    }
  },

  // Get user's saved events
  async getSavedEvents() {
    try {
      const response = await api.get('/events/saved')
      return response.data
    } catch (error) {
      console.log('API not available, using mock saved events')
      return {
        events: mockEvents.slice(0, 2) // Return first 2 events as saved
      }
    }
  },

  // Get user's registered events
  async getRegisteredEvents() {
    try {
      const response = await api.get('/events/registered')
      return response.data
    } catch (error) {
      console.log('API not available, using mock registered events')
      return {
        events: mockEvents // Return all events as registered for demo
      }
    }
  },

  // Search events
  async searchEvents(query, filters = {}) {
    try {
      const params = { q: query, ...filters }
      const response = await api.get('/search/events', { params })
      return response.data
    } catch (error) {
      console.log('API not available, using mock search')
      const filtered = mockEvents.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase())
      )
      return { events: filtered }
    }
  },

  // Get event attendees
  async getEventAttendees(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/attendees`)
      return response.data
    } catch (error) {
      console.log('API not available, using mock attendees')
      return {
        attendees: [
          { name: 'John Doe', id: 1 },
          { name: 'Jane Smith', id: 2 },
          { name: 'Mike Johnson', id: 3 }
        ]
      }
    }
  },
}