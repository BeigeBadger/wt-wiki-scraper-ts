import { gql, useQuery } from '@apollo/client';

export const GET_VEHICLES_QUERY = gql`
  query GetVehicles {
    vehicles {
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

export interface VehiclesQueryResult {
  vehicles: Vehicle[];
}

export function useQueryVehicles() {
  return useQuery<VehiclesQueryResult>(GET_VEHICLES_QUERY);
}
