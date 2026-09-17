import React from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

function LoadingSpinner({ size = 'medium', className }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  }

  return (
    <Loader2
      className={clsx(
        'animate-spin text-primary-600',
        sizeClasses[size],
        className
      )}
    />
  )
}

export default LoadingSpinner