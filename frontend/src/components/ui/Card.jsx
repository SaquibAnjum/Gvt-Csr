import React from 'react'
import { clsx } from 'clsx'

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-secondary-200',
        hover && 'hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1',
        gradient && 'bg-gradient-to-br from-white to-secondary-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('px-6 py-4 border-b border-secondary-200', className)} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className = '', ...props }) => (
  <div className={clsx('px-6 py-4', className)} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={clsx('px-6 py-4 border-t border-secondary-200 bg-secondary-50/50', className)} {...props}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
