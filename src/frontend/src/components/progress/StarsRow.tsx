import React from 'react';
import { Star } from 'lucide-react';

interface StarsRowProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarsRow({ stars, maxStars = 3, size = 'md' }: StarsRowProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < stars 
              ? 'fill-secondary text-secondary animate-bounce-in' 
              : 'fill-muted text-muted'
          }`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
