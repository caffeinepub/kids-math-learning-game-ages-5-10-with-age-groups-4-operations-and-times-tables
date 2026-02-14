import React, { useState } from 'react';

type MascotState = 'idle' | 'cheer' | 'encourage';

interface MascotProps {
  state?: MascotState;
  className?: string;
}

export default function Mascot({ state = 'idle', className = '' }: MascotProps) {
  const [imageError, setImageError] = useState(false);

  const getMascotImage = () => {
    switch (state) {
      case 'cheer':
        return '/assets/generated/mascot-2.dim_1024x1024.png';
      case 'encourage':
        return '/assets/generated/mascot-3.dim_1024x1024.png';
      default:
        return '/assets/generated/mascot-1.dim_1024x1024.png';
    }
  };

  const getAnimation = () => {
    switch (state) {
      case 'cheer':
        return 'animate-bounce-in';
      case 'encourage':
        return 'animate-wiggle';
      default:
        return 'animate-float';
    }
  };

  const getFallbackEmoji = () => {
    switch (state) {
      case 'cheer':
        return '🎉';
      case 'encourage':
        return '💪';
      default:
        return '🤖';
    }
  };

  if (imageError) {
    return (
      <div className={`${className} ${getAnimation()} flex items-center justify-center`}>
        <div className="text-9xl" role="img" aria-label="Math mascot">
          {getFallbackEmoji()}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} ${getAnimation()}`}>
      <img 
        src={getMascotImage()} 
        alt="Math mascot" 
        className="w-full h-full object-contain drop-shadow-2xl"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
