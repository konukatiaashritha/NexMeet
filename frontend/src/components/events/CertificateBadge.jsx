import React from 'react'
import { Award } from 'lucide-react'

function CertificateBadge({ certificate, size = 'sm' }) {
  if (!certificate || !certificate.available) {
    return null
  }

  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  }

  return (
    <span className={`inline-flex items-center bg-primary-100 text-primary-700 font-medium rounded-full ${sizeClasses[size]}`}>
      <Award className={`${iconSizes[size]} mr-1`} />
      Certificate
    </span>
  )
}

export default CertificateBadge