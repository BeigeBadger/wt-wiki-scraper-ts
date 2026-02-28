import type { FilterCardOption } from '../FilterCardGroup';

export const NATION_FLAGS: Record<string, string> = {
  usa: '🇺🇸',
  germany: '🇩🇪',
  ussr: '🇷🇺',
  britain: '🇬🇧',
  japan: '🇯🇵',
  italy: '🇮🇹',
  france: '🇫🇷',
  china: '🇨🇳',
  sweden: '🇸🇪',
};

export const CATEGORY_ICONS: Record<string, string> = {
  aviation: '✈️',
  helicopters: '🚁',
  ground: '🚗',
  ships: '⛵',
  boats: '🚤',
};

export const GAME_MODES: FilterCardOption[] = [
  { id: 'arcade', name: 'Arcade' },
  { id: 'realistic', name: 'Realistic' },
  { id: 'simulator', name: 'Simulator' },
];

export const DEFAULT_BR_RANGE: [number, number] = [1.0, 11.7];
