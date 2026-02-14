export interface StickerReward {
  id: string;
  name: string;
  imagePath: string;
  emoji: string;
}

export const STICKER_CATALOG: StickerReward[] = [
  {
    id: 'star',
    name: 'Shining Star',
    imagePath: '/assets/generated/sticker-star.dim_256x256.png',
    emoji: '⭐'
  },
  {
    id: 'rocket',
    name: 'Super Rocket',
    imagePath: '/assets/generated/sticker-rocket.dim_256x256.png',
    emoji: '🚀'
  },
  {
    id: 'dino',
    name: 'Friendly Dino',
    imagePath: '/assets/generated/sticker-dino.dim_256x256.png',
    emoji: '🦕'
  },
  {
    id: 'unicorn',
    name: 'Magic Unicorn',
    imagePath: '/assets/generated/sticker-unicorn.dim_256x256.png',
    emoji: '🦄'
  },
  {
    id: 'wizard-hat',
    name: 'Wizard Hat',
    imagePath: '/assets/generated/sticker-wizard-hat.dim_256x256.png',
    emoji: '🎩'
  },
  {
    id: 'trophy',
    name: 'Golden Trophy',
    imagePath: '/assets/generated/sticker-trophy.dim_256x256.png',
    emoji: '🏆'
  }
];

// Deterministic selection based on completion count
export function selectStickerReward(completionCount: number): StickerReward {
  const index = completionCount % STICKER_CATALOG.length;
  return STICKER_CATALOG[index];
}
