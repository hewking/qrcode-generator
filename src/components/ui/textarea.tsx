interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = ({ className = '', ...props }: TextAreaProps) => {
  return (
    <textarea
      className={`
        w-full p-3 border-2 rounded-lg
        bg-gray-50 text-gray-900
        transition-all duration-200
        placeholder:text-gray-400
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        hover:border-blue-200
        ${className}
      `}
      {...props}
    />
  )
}

export default TextArea 