interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const Button = ({ variant = 'primary', className = '', children, ...props }: ButtonProps) => {
  const baseStyles = `
    px-4 py-2 rounded-lg font-medium
    transform transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `
  
  const variants = {
    primary: `
      bg-blue-500 text-white
      hover:bg-blue-600 active:bg-blue-700
      focus:ring-blue-500
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200 active:bg-gray-300
      focus:ring-gray-500
    `
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button 