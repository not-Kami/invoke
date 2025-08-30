

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
        disabled:bg-gray-50 disabled:text-gray-500
        ${className}
      `}
      {...props}
    />
  );
}
