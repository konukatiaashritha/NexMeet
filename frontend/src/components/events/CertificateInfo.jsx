import React, { useState } from 'react'
import { Award, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import Button from '../common/Button'

function CertificateInfo({ certificate, compact = false }) {
  const [isExpanded, setIsExpanded] = useState(!compact)

  if (!certificate || !certificate.available) {
    return null
  }

  const getCertificateTypeColor = (type) => {
    switch (type) {
      case 'completion':
        return 'bg-green-100 text-green-700'
      case 'achievement':
        return 'bg-purple-100 text-purple-700'
      case 'participation':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-secondary-100 text-secondary-700'
    }
  }

  const formatSkills = (skills) => {
    if (!skills || skills.length === 0) return null
    return skills.join(', ')
  }

  const formatDeliveryMethod = (method) => {
    const methods = {
      'automatic': 'Automatically',
      'after_attending': 'After attending',
      'after_assessment': 'After completing an assessment',
      'after_requirements': 'After completing the event requirements'
    }
    return methods[method] || method
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 flex items-center">
                Certificate Available
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getCertificateTypeColor(certificate.type)}`}>
                  {certificate.type?.charAt(0).toUpperCase() + certificate.type?.slice(1)}
                </span>
              </h4>
              <p className="text-sm text-secondary-600">
                Issued by <span className="font-medium">{certificate.issued_by}</span>
                {certificate.cost === 'free' ? ' • Free' : certificate.cost === 'paid' && certificate.amount ? ` • $${certificate.amount}` : ''}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-primary-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {certificate.skills_covered && certificate.skills_covered.length > 0 && (
                <div>
                  <h5 className="font-medium text-secondary-900 mb-2">Skills Covered:</h5>
                  <div className="flex flex-wrap gap-1">
                    {certificate.skills_covered.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {certificate.eligibility_requirements && (
                <div>
                  <h5 className="font-medium text-secondary-900 mb-1">Eligibility:</h5>
                  <p className="text-secondary-600">{certificate.eligibility_requirements}</p>
                </div>
              )}

              {certificate.delivery_method && (
                <div>
                  <h5 className="font-medium text-secondary-900 mb-1">How to Receive:</h5>
                  <p className="text-secondary-600">{formatDeliveryMethod(certificate.delivery_method)}</p>
                </div>
              )}

              {certificate.additional_info && (
                <div>
                  <h5 className="font-medium text-secondary-900 mb-1">Additional Information:</h5>
                  <p className="text-secondary-600">{certificate.additional_info}</p>
                </div>
              )}
            </div>

            {certificate.certificate_link && (
              <div className="mt-3 pt-3 border-t border-primary-200">
                <a
                  href={certificate.certificate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-700 hover:text-primary-800 font-medium"
                >
                  View Certificate Information
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Full view for event details page
  return (
    <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
          <Award className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">Certificate Information</h3>
          <p className="text-secondary-600">Additional credential available for this event</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-secondary-900 mb-3">Certificate Details</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-secondary-600">Issued By:</span>
              <p className="font-medium text-secondary-900">{certificate.issued_by}</p>
            </div>

            <div>
              <span className="text-sm text-secondary-600">Certificate Type:</span>
              <div className="flex items-center mt-1">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCertificateTypeColor(certificate.type)}`}>
                  Certificate of {certificate.type?.charAt(0).toUpperCase() + certificate.type?.slice(1)}
                </span>
              </div>
            </div>

            {certificate.skills_covered && certificate.skills_covered.length > 0 && (
              <div>
                <span className="text-sm text-secondary-600">Skills Covered:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {certificate.skills_covered.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-sm text-secondary-600">Cost:</span>
              <p className="font-medium text-secondary-900">
                {certificate.cost === 'free' ? 'Free' : 
                 certificate.cost === 'paid' && certificate.amount ? `$${certificate.amount}` : 
                 'Contact organizer for pricing'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-secondary-900 mb-3">Requirements & Delivery</h4>
          <div className="space-y-3">
            {certificate.eligibility_requirements && (
              <div>
                <span className="text-sm text-secondary-600">Eligibility:</span>
                <p className="text-secondary-900">{certificate.eligibility_requirements}</p>
              </div>
            )}

            <div>
              <span className="text-sm text-secondary-600">How to Receive:</span>
              <p className="text-secondary-900">{formatDeliveryMethod(certificate.delivery_method)}</p>
            </div>

            {certificate.additional_info && (
              <div>
                <span className="text-sm text-secondary-600">Additional Instructions:</span>
                <p className="text-secondary-900">{certificate.additional_info}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {certificate.certificate_link && (
        <div className="mt-6 pt-4 border-t border-primary-200">
          <a
            href={certificate.certificate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg font-medium transition-colors"
          >
            View Certificate Information
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      )}
    </div>
  )
}

export default CertificateInfo