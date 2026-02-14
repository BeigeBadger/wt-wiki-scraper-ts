export type BattleRatingMode = 'arcade' | 'realistic' | 'simulator';

export interface BattleRating {
  arcade: number | null;
  realistic: number | null;
  simulator: number | null;
}

export interface Vehicle {
  name: string;
  rank: number | null;
  battleRating: BattleRating;
  role: string | null;
}

export interface CategoryData {
  country: string;
  category: string;
  vehicles: Vehicle[];
}

export interface ErrorEntry {
  url: string;
  type: 'selector' | 'network' | 'parse';
  message: string;
}

export type Country =
  | 'usa'
  | 'germany'
  | 'ussr'
  | 'britain'
  | 'japan'
  | 'italy'
  | 'france'
  | 'china'
  | 'sweden';

export type VehicleCategory = 'aviation' | 'helicopters' | 'ground' | 'ships' | 'boats';

export const COUNTRIES: Country[] = [
  'usa',
  'germany',
  'ussr',
  'britain',
  'japan',
  'italy',
  'france',
  'china',
  'sweden',
];

export const BR_MODES: BattleRatingMode[] = ['arcade', 'realistic', 'simulator'];

export const BR_MODE_IDS: Record<BattleRatingMode, string> = {
  arcade: 'ab',
  realistic: 'rb',
  simulator: 'sb',
};
