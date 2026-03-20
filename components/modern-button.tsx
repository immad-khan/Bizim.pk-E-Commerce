import React from 'react'

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary'
}

export default function ModernButton({ 
  children, 
  href,
  variant = 'primary',
  className = '',
  ...props 
}: ModernButtonProps) {
  const baseStyles = 'font-bold py-3 px-8 rounded-2xl transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-background'
  
  const variantStyles = {
    primary: 'bg-gradient-to-b from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800',
    secondary: 'bg-gradient-to-b from-slate-400 to-slate-600 text-white hover:from-slate-500 hover:to-slate-700'
  }

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={combinedStyles}>
        {children}
      </a>
    )
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  )
}
