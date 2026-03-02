import { gql, useQuery } from '@apollo/client';
import { handleGqlError } from '../../lib/toastUtils';

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

export interface VehiclesQueryResult {
  vehicles: Vehicle[];
}

export const VEHICLES_QUERY = gql`
  query GetVehicles(
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

export interface UseQueryVehiclesOptions {
  country?: string | null;
  category?: string | null;
  gameMode?: string | null;
  minBr?: number | null;
  maxBr?: number | null;
  roles?: string[];
  skip?: boolean;
}

export function useQueryVehicles(options: UseQueryVehiclesOptions = {}) {
  const { country, category, gameMode, minBr, maxBr, roles, skip = false } = options;

  return useQuery<VehiclesQueryResult>(VEHICLES_QUERY, {
    variables: {
      country: country ?? undefined,
      category: category ?? undefined,
      gameMode: gameMode ?? undefined,
      minBr: minBr ?? undefined,
      maxBr: maxBr ?? undefined,
      roles,
    },
    skip,
    onError: handleGqlError,
  });
}
