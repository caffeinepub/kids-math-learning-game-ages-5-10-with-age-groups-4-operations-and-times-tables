import React, { useState } from 'react';
import { StickerReward } from '../../rewards/stickers';

interface StickerBoardProps {
  earnedStickers: StickerReward[];
  maxSlots?: number;
}

export default function StickerBoard({ earnedStickers, maxSlots = 12 }: StickerBoardProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (stickerId: string) => {
    setImageErrors(prev => ({ ...prev, [stickerId]: true }));
  };

  // Create array of slots with earned stickers or empty
  const slots = Array.from({ length: maxSlots }, (_, index) => {
    return earnedStickers[index] || null;
  });

  return (
    <div className="relative w-full">
      {/* Background board image */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-primary/20 shadow-kid bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20">
        <img
          src="/assets/generated/sticker-board-bg.dim_1200x800.png"
          alt="Sticker board background"
          className="w-full h-auto opacity-30"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Sticker slots overlay */}
        <div className="absolute inset-0 p-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 h-full">
            {slots.map((sticker, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-primary/30 shadow-md hover:scale-110 transition-transform"
              >
                {sticker ? (
                  <div className="flex flex-col items-center justify-center p-2">
                    {!imageErrors[`${sticker.id}-${index}`] ? (
                      <img
                        src={sticker.imagePath}
                        alt={sticker.name}
                        className="w-16 h-16 sm:w-20 sm:h-20"
                        onError={() => handleImageError(`${sticker.id}-${index}`)}
                      />
                    ) : (
                      <div className="text-4xl sm:text-5xl">{sticker.emoji}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-4xl sm:text-5xl opacity-20">❓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Progress text */}
      <div className="text-center mt-6">
        <p className="text-xl md:text-2xl font-normal">
          Collected: <span className="font-bold">{earnedStickers.length}</span> / {maxSlots} stickers
        </p>
      </div>
    </div>
  );
}
