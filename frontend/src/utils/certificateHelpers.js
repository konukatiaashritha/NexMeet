import { CERTIFICATE_TYPES, CERTIFICATE_DELIVERY_METHODS } from '../constants'

// Certificate utility functions for NexMeet platform

/**
 * Format certificate type for display
 */
export const formatCertificateType = (type) => {
  const typeMap = {
    participation: 'Certificate of Participation',
    completion: 'Certificate of Completion', 
    achievement: 'Certificate of Achievement',
    other: 'Certificate'
  }
  return typeMap[type] || 'Certificate'
}

/**
 * Get certificate type color scheme
 */
export const getCertificateTypeColor = (type) => {
  const colorMap = {
    completion: 'bg-green-100 text-green-700 border-green-200',
    achievement: 'bg-purple-100 text-purple-700 border-purple-200',
    participation: 'bg-blue-100 text-blue-700 border-blue-200',
    other: 'bg-secondary-100 text-secondary-700 border-secondary-200'
  }
  return colorMap[type] || colorMap.other
}

/**
 * Format delivery method for display
 */
export const formatDeliveryMethod = (method) => {
  const methodMap = {
    automatic: 'Automatically upon registration',
    after_attending: 'After attending the event',
    after_assessment: 'After completing an assessment',
    after_requirements: 'After completing event requirements'
  }
  return methodMap[method] || method
}

/**
 * Format certificate cost for display
 */
export const formatCertificateCost = (certificate) => {
  if (!certificate) return null
  
  if (certificate.cost_type === 'free') {
    return 'Free'
  } else if (certificate.cost_type === 'paid' && certificate.cost_amount) {
    return `$${certificate.cost_amount}`
  } else if (certificate.cost_type === 'paid') {
    return 'Paid (Contact organizer for pricing)'
  }
  return 'Contact organizer'
}

/**
 * Check if certificate is available for an event
 */
export const hasCertificate = (event) => {
  return event?.certificate?.available === true
}

/**
 * Get certificate skills as formatted array
 */
export const getCertificateSkills = (certificate) => {
  if (!certificate?.skills_covered) return []
  return Array.isArray(certificate.skills_covered) 
    ? certificate.skills_covered 
    : certificate.skills_covered.split(',').map(skill => skill.trim())
}

/**
 * Generate certificate display data for UI components
 */
export const getCertificateDisplayData = (certificate) => {
  if (!certificate || !certificate.available) return null
  
  return {
    isAvailable: true,
    issuedBy: certificate.issued_by || 'Event Organizer',
    type: formatCertificateType(certificate.certificate_type),
    typeColor: getCertificateTypeColor(certificate.certificate_type),
    skills: getCertificateSkills(certificate),
    cost: formatCertificateCost(certificate),
    eligibility: certificate.eligibility_requirements || 'Complete event requirements',
    delivery: formatDeliveryMethod(certificate.delivery_method),
    link: certificate.certificate_link,
    additionalInfo: certificate.additional_info,
    isFree: certificate.cost_type === 'free',
    isPaid: certificate.cost_type === 'paid'
  }
}

/**
 * Validate certificate data (for organizer forms)
 */
export const validateCertificateData = (certificateData) => {
  const errors = {}
  
  if (certificateData.available) {
    if (!certificateData.issued_by?.trim()) {
      errors.issued_by = 'Issuing organization is required'
    }
    
    if (!certificateData.certificate_type) {
      errors.certificate_type = 'Certificate type is required'
    }
    
    if (!certificateData.cost_type) {
      errors.cost_type = 'Cost information is required'
    }
    
    if (certificateData.cost_type === 'paid' && !certificateData.cost_amount) {
      errors.cost_amount = 'Amount is required for paid certificates'
    }
    
    if (!certificateData.delivery_method) {
      errors.delivery_method = 'Delivery method is required'
    }
    
    if (certificateData.certificate_link && !isValidUrl(certificateData.certificate_link)) {
      errors.certificate_link = 'Please enter a valid URL'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Simple URL validation
 */
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Create sample certificate data for demo/testing
 */
export const createSampleCertificate = (type = 'completion') => {
  const samples = {
    completion: {
      available: true,
      issued_by: 'Google',
      certificate_type: 'completion',
      skills_covered: ['Machine Learning', 'Python', 'Data Analysis'],
      eligibility_requirements: 'Attend the full workshop and complete the assessment',
      cost_type: 'free',
      delivery_method: 'after_assessment',
      certificate_link: 'https://developers.google.com/certification',
      additional_info: 'Certificate will be sent via email within 5 business days'
    },
    participation: {
      available: true,
      issued_by: 'Tech Conference 2024',
      certificate_type: 'participation',
      skills_covered: ['Networking', 'Technology Trends'],
      eligibility_requirements: 'Attend at least 50% of the sessions',
      cost_type: 'free',
      delivery_method: 'after_attending'
    },
    achievement: {
      available: true,
      issued_by: 'Stanford University',
      certificate_type: 'achievement',
      skills_covered: ['Research Methodology', 'Academic Writing'],
      eligibility_requirements: 'Complete all assignments and pass final evaluation',
      cost_type: 'paid',
      cost_amount: 50,
      delivery_method: 'after_requirements',
      certificate_link: 'https://online.stanford.edu/certificates'
    }
  }
  
  return samples[type] || samples.completion
}

/**
 * Filter events by certificate availability
 */
export const filterEventsByCertificate = (events, showOnlyCertified = false) => {
  if (!showOnlyCertified) return events
  return events.filter(event => hasCertificate(event))
}

/**
 * Get certificate statistics for dashboard/analytics
 */
export const getCertificateStats = (events) => {
  const totalEvents = events.length
  const eventsWithCertificates = events.filter(hasCertificate).length
  const freeeCertificates = events.filter(event => 
    hasCertificate(event) && event.certificate.cost_type === 'free'
  ).length
  
  return {
    totalEvents,
    eventsWithCertificates,
    certificatePercentage: totalEvents ? Math.round((eventsWithCertificates / totalEvents) * 100) : 0,
    freeCertificates: freeeCertificates,
    paidCertificates: eventsWithCertificates - freeeCertificates
  }
}