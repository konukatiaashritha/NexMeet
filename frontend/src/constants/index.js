// Event categories
export const EVENT_CATEGORIES = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'networking', label: 'Networking' },
  { value: 'career', label: 'Career Event' },
  { value: 'startup', label: 'Startup Event' },
  { value: 'research', label: 'Research Event' },
  { value: 'community', label: 'Community Event' },
  { value: 'lecture', label: 'Guest Lecture' },
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

// Networking goals
export const NETWORKING_GOALS = [
  { value: 'learn', label: 'Learn from others' },
  { value: 'mentor', label: 'Find mentors' },
  { value: 'collaborate', label: 'Find collaborators' },
  { value: 'career', label: 'Explore careers' },
  { value: 'jobs', label: 'Find job opportunities' },
  { value: 'startup', label: 'Find startup opportunities' },
  { value: 'professionals', label: 'Meet professionals' },
  { value: 'students', label: 'Meet students' },
  { value: 'network', label: 'Build professional network' },
  { value: 'hiring', label: 'Find talent to hire' },
]

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

// Social media platforms
export const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { value: 'twitter', label: 'Twitter', icon: 'twitter' },
  { value: 'github', label: 'GitHub', icon: 'github' },
  { value: 'website', label: 'Website', icon: 'globe' },
]