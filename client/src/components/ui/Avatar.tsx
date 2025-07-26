import React from 'react';
import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ 
  src, 
  alt, 
  firstName = '', 
  lastName = '', 
  size = 'md', 
  className 
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const initials = getInitials(firstName, lastName);

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-gray-500 text-white font-medium',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || `${firstName} ${lastName}`}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}