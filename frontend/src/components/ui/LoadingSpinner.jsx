import React from 'react'
import { clsx } from 'clsx'

const LoadingSpinner = ({ 
  size = 'md', 
  className = '',
  text = 'Loading...' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div className={clsx('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={clsx('animate-spin rounded-full border-2 border-primary-200 border-t-primary-600', sizes[size])} />
      {text && (
        <p className="text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
