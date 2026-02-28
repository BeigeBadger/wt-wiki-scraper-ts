import { gql, useQuery } from '@apollo/client';

export const LINE_UP_VEHICLES_QUERY = gql`
  query LineUpVehicles(
    $country: String
    $category: String
    $gameMode: String
    $minBr: Float
    $maxBr: Float
    $roles: [String!]
  ) {
    vehicles(
      country: $country
      category: $category
      gameMode: $gameMode
      minBr: $minBr
      maxBr: $maxBr
      roles: $roles
    ) {
      id
      name
      country
      category
      rank
      role
      battleRating {
        arcade
        realistic
        simulator
      }
    }
  }
`;

export interface VehicleBattleRating {
  arcade: number | null;
  realistic: number | null;
  simulator: number | null;
}

export interface Vehicle {
  id: string;
  name: string;
  country: string;
  category: string;
  rank: number | null;
  role: string | null;
  battleRating: VehicleBattleRating;
}

export interface VehiclesWithFilterQueryResult {
  vehicles: Vehicle[];
}

export interface UseQueryVehiclesWithFilterOptions {
  country?: string | null;
  category?: string | null;
  gameMode?: string | null;
  minBr?: number | null;
  maxBr?: number | null;
  roles?: string[];
  skip?: boolean;
}

export function useQueryVehiclesWithFilter(options: UseQueryVehiclesWithFilterOptions = {}) {
  const { country, category, gameMode, minBr, maxBr, roles, skip = false } = options;

  return useQuery<VehiclesWithFilterQueryResult>(LINE_UP_VEHICLES_QUERY, {
    variables: {
      country: country ?? undefined,
      category: category ?? undefined,
      gameMode: gameMode ?? undefined,
      minBr: minBr ?? undefined,
      maxBr: maxBr ?? undefined,
      roles,
    },
    skip,
  });
}
