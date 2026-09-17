import React from 'react'
import { clsx } from 'clsx'
import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary', 
  outline: 'btn-outline',
  ghost: 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 px-4 py-2 rounded-lg font-medium transition-colors',
  danger: 'bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props 
}) {
  const isDisabled = disabled || loading

  return (
    <button
      className={clsx(
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="small" className="mr-2" />
      )}
      {children}
    </button>
  )
}

export default Button