// Event categories
export const EVENT_CATEGORIES = [
  { value: 'workshop', label: 'Workshop', emoji: '🛠️' },
  { value: 'conference', label: 'Conference', emoji: '🎤' },
  { value: 'seminar', label: 'Seminar', emoji: '📖' },
  { value: 'meetup', label: 'Meetup', emoji: '🤝' },
  { value: 'hackathon', label: 'Hackathon', emoji: '💻' },
  { value: 'webinar', label: 'Webinar', emoji: '🖥️' },
  { value: 'networking', label: 'Networking Event', emoji: '🌐' },
  { value: 'career', label: 'Career Event', emoji: '💼' },
  { value: 'startup', label: 'Startup Event', emoji: '🚀' },
  { value: 'research', label: 'Research Event', emoji: '🔬' },
  { value: 'community', label: 'Community Event', emoji: '👥' },
  { value: 'lecture', label: 'Guest Lecture', emoji: '🎓' },
  { value: 'tech', label: 'Tech Event', emoji: '⚡' },
  { value: 'company', label: 'Company Event', emoji: '🏢' },
  { value: 'college', label: 'College Event', emoji: '🎒' },
]

// Event levels
export const EVENT_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'all', label: 'All Levels' },
]

// Event types
export const EVENT_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'In-Person' },
  { value: 'hybrid', label: 'Hybrid' },
]

// Career fields
export const CAREER_FIELDS = [
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'research', label: 'Research' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'nonprofit', label: 'Non-Profit' },
  { value: 'government', label: 'Government' },
  { value: 'media', label: 'Media' },
  { value: 'arts', label: 'Arts & Entertainment' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'other', label: 'Other' },
]

// Experience levels
export const EXPERIENCE_LEVELS = [
  { value: 'student', label: 'Student' },
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'executive', label: 'Executive (10+ years)' },
]

// Networking goals (enhanced from existing)
export const NETWORKING_GOALS = [
  { value: 'meet_people', label: '🤝 Meet new people', icon: '🤝' },
  { value: 'learn', label: '📚 Learn from others', icon: '📚' },
  { value: 'find_mentor', label: '🧑‍🏫 Find a mentor', icon: '🧑‍🏫' },
  { value: 'career_opportunities', label: '💼 Explore career opportunities', icon: '💼' },
  { value: 'startup_collaborators', label: '🚀 Find startup collaborators', icon: '🚀' },
  { value: 'research_collaborators', label: '🔬 Find research collaborators', icon: '🔬' },
  { value: 'meet_professionals', label: '👥 Meet professionals', icon: '👥' },
  { value: 'meet_students', label: '🎓 Meet students', icon: '🎓' },
  { value: 'project_teammates', label: '💻 Find project teammates', icon: '💻' },
  { value: 'build_network', label: '🌐 Build professional network', icon: '🌐' },
]

// Looking for options
export const LOOKING_FOR_OPTIONS = [
  { value: 'mentors', label: 'Mentors', description: 'Experienced professionals to guide my career' },
  { value: 'collaborators', label: 'Collaborators', description: 'Partners for projects and ideas' },
  { value: 'teammates', label: 'Project teammates', description: 'People to work with on specific projects' },
  { value: 'internships', label: 'Internship opportunities', description: 'Companies offering internship positions' },
  { value: 'career_connections', label: 'Career connections', description: 'Professional contacts in my field' },
  { value: 'startup_connections', label: 'Startup connections', description: 'Entrepreneurs and startup ecosystem contacts' },
  { value: 'researchers', label: 'Researchers', description: 'Academic and industry researchers' },
  { value: 'professionals', label: 'Industry professionals', description: 'Working professionals in my domain' },
  { value: 'students', label: 'Students with similar interests', description: 'Fellow students and learners' },
  { value: 'investors', label: 'Investors', description: 'People interested in funding projects' },
]

// Connection request statuses
export const CONNECTION_STATUS = {
  NONE: 'none',
  PENDING_SENT: 'pending_sent',
  PENDING_RECEIVED: 'pending_received',
  CONNECTED: 'connected',
  REJECTED: 'rejected',
}

// Privacy settings options
export const PRIVACY_OPTIONS = {
  PUBLIC: 'public',
  CONNECTIONS: 'connections',
  PRIVATE: 'private',
}

// Attendance visibility options
export const ATTENDANCE_VISIBILITY = {
  VISIBLE: 'visible',
  CONNECTIONS_ONLY: 'connections_only',
  HIDDEN: 'hidden',
}

// Connection request preferences
export const CONNECTION_PREFERENCES = {
  ANYONE: 'anyone',
  SAME_INTERESTS: 'same_interests',
  SAME_EVENTS: 'same_events',
  CONNECTIONS_OF_CONNECTIONS: 'connections_of_connections',
}

// Popular skills (for autocomplete/suggestions)
export const POPULAR_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL',
  'Machine Learning', 'Data Science', 'AI/ML', 'DevOps', 'Cloud Computing',
  'Project Management', 'Product Management', 'UX/UI Design', 'Graphic Design',
  'Digital Marketing', 'Content Marketing', 'SEO', 'Social Media Marketing',
  'Business Analysis', 'Financial Analysis', 'Accounting', 'Consulting',
  'Leadership', 'Team Management', 'Communication', 'Public Speaking',
  'Research', 'Writing', 'Teaching', 'Mentoring'
]

// Popular interests
export const POPULAR_INTERESTS = [
  'Artificial Intelligence', 'Machine Learning', 'Blockchain', 'Cybersecurity',
  'Web Development', 'Mobile Development', 'Data Science', 'Cloud Computing',
  'Startup Ecosystem', 'Entrepreneurship', 'Product Development', 'Innovation',
  'Digital Transformation', 'Fintech', 'Healthtech', 'Edtech', 'Sustainability',
  'Renewable Energy', 'Climate Change', 'Social Impact', 'Diversity & Inclusion',
  'Remote Work', 'Future of Work', 'Leadership', 'Personal Development',
  'Investing', 'Cryptocurrency', 'E-commerce', 'Gaming', 'Virtual Reality'
]

// App configuration
export const APP_CONFIG = {
  name: 'NexMeet',
  tagline: 'Discover. Connect. Grow.',
  description: 'Event discovery and professional networking platform',
  version: '1.0.0',
  
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Search
  minSearchLength: 2,
  searchDebounceMs: 300,
  
  // Files
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Validation
  minPasswordLength: 8,
  maxBioLength: 500,
  maxEventDescriptionLength: 5000,
  
  // URLs
  supportEmail: 'support@nexmeet.com',
  contactEmail: 'contact@nexmeet.com',
  privacyPolicyUrl: '/privacy',
  termsOfServiceUrl: '/terms',
}

// API endpoints base paths
export const API_ENDPOINTS = {
  auth: '/auth',
  users: '/users',
  events: '/events',
  search: '/search',
  recommendations: '/recommendations',
  notifications: '/notifications',
  upload: '/upload',
}

// Route paths
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  profile: '/profile',
  events: '/events',
  eventDetails: '/events/:id',
  savedEvents: '/saved-events',
  registeredEvents: '/registered-events',
  communities: '/communities',
  notifications: '/notifications',
  settings: '/settings',
}

// Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
}

// Local storage keys
export const STORAGE_KEYS = {
  token: 'nexmeet_token',
  user: 'nexmeet_user',
  theme: 'nexmeet_theme',
  filters: 'nexmeet_filters',
  searches: 'nexmeet_searches',
}

// Theme configuration
export const THEME = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
  }
}

// Date formats
export const DATE_FORMATS = {
  short: 'MMM dd',
  medium: 'MMM dd, yyyy',
  long: 'EEEE, MMMM dd, yyyy',
  time: 'h:mm a',
  datetime: 'MMM dd, yyyy h:mm a',
}

// Certificate types
export const CERTIFICATE_TYPES = [
  { value: 'participation', label: 'Participation' },
  { value: 'completion', label: 'Completion' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'other', label: 'Other' },
]

// Certificate delivery methods
export const CERTIFICATE_DELIVERY_METHODS = [
  { value: 'automatic', label: 'Automatically' },
  { value: 'after_attending', label: 'After attending' },
  { value: 'after_assessment', label: 'After completing an assessment' },
  { value: 'after_requirements', label: 'After completing the event requirements' },
]

// Social media platforms
export const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { value: 'twitter', label: 'Twitter', icon: 'twitter' },
  { value: 'github', label: 'GitHub', icon: 'github' },
  { value: 'website', label: 'Website', icon: 'globe' },
]