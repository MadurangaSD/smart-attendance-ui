import React from 'react'

export default function Button({
  children,
  onClick,
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  color = 'sky', // 'sky', 'blue', 'green', 'red', etc.
  ariaLabel,
  ...rest
}) {
  // Color classes
  const colorClasses = {
    sky: 'bg-sky-600 hover:bg-sky-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    gray: 'bg-gray-600 hover:bg-gray-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    white: 'bg-white text-sky-600 border border-sky-600 hover:bg-sky-50',
  }
  const baseClasses =
    'px-4 py-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed '

  return (
    <button
      type={type}
      onClick={onClick}
      className={
        baseClasses +
        (colorClasses[color] || colorClasses.sky) +
        ' ' + className
      }
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></span>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}