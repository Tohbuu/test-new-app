export const THEME_STORAGE_KEY = 'animetail-forge-theme';
export const THEME_COOKIE_KEY = 'animetail-forge-theme';

export type ThemeId = 'discord' | 'midnight' | 'ember' | 'forest' | 'aurora' | 'violet';

export type ThemeOption = {
  id: ThemeId;
  label: string;
  description: string;
  swatch: string;
};

export const defaultTheme: ThemeId = 'discord';

export const themeOptions: ThemeOption[] = [
  {
    id: 'discord',
    label: 'Discord',
    description: 'Classic slate and blur.',
    swatch: 'linear-gradient(135deg, #404eed 0%, #5865f2 48%, #2b2d31 100%)',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    description: 'Cool violet glass.',
    swatch: 'linear-gradient(135deg, #0f172a 0%, #8b5cf6 52%, #020617 100%)',
  },
  {
    id: 'ember',
    label: 'Ember',
    description: 'Warm red-orange glow.',
    swatch: 'linear-gradient(135deg, #7c2d12 0%, #fb923c 52%, #ef4444 100%)',
  },
  {
    id: 'forest',
    label: 'Forest',
    description: 'Deep green calm.',
    swatch: 'linear-gradient(135deg, #052e16 0%, #22c55e 52%, #0f766e 100%)',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    description: 'Teal with sky highlights.',
    swatch: 'linear-gradient(135deg, #052e2b 0%, #2dd4bf 46%, #60a5fa 100%)',
  },
  {
    id: 'violet',
    label: 'Violet',
    description: 'Synthetic dusk neon.',
    swatch: 'linear-gradient(135deg, #312e81 0%, #c084fc 48%, #ec4899 100%)',
  },
];

export function isThemeId(value: string): value is ThemeId {
  return themeOptions.some((option) => option.id === value);
}

export function resolveTheme(value: string | undefined | null): ThemeId {
  if (value && isThemeId(value)) {
    return value;
  }

  return defaultTheme;
}
