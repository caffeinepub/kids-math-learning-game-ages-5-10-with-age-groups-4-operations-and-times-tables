/**
 * Kids Math Game Theme Documentation
 * 
 * Color Palette (Bright Pastels):
 * - Primary (Soft Purple): Fun, magical learning color for main actions
 * - Secondary (Soft Peach): Warm, gentle color for secondary actions
 * - Accent (Soft Mint): Fresh, positive color for success states
 * - Success (Soft Green): Celebration color for correct answers
 * - Warning (Soft Yellow): Gentle attention color for hints
 * 
 * Typography:
 * - Font Family: Comic Sans MS / Chalkboard SE - playful, kid-friendly
 * - Color: Black/near-black for maximum readability
 * - Large sizes throughout for easy reading
 * - High contrast against pastel backgrounds for accessibility
 * 
 * Spacing & Layout:
 * - Extra padding and margins for easy tap targets (min 44x44px)
 * - Rounded corners (24px) for friendly, soft appearance
 * - Generous whitespace to reduce visual clutter
 * 
 * Animation:
 * - Bounce-in for celebrations
 * - Wiggle for attention
 * - Float for ambient movement
 */

export const theme = {
  name: 'Kids Math Adventure',
  description: 'A bright pastel theme with high-contrast black text designed for children aged 5-10',
  colors: {
    primary: 'Soft Purple - magical learning',
    secondary: 'Soft Peach - gentle fun',
    accent: 'Soft Mint - positive growth',
    success: 'Soft Green - celebration',
    warning: 'Soft Yellow - gentle hints',
    background: 'Bright pastel - soft and inviting'
  },
  typography: {
    family: 'Comic Sans MS, Chalkboard SE',
    color: 'Black/near-black for readability',
    purpose: 'Friendly, approachable, kid-focused with excellent contrast'
  }
} as const;
