import { gql, useQuery } from '@apollo/client';

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
    }
  }
`;

export interface VehicleCategory {
  id: string;
  name: string;
}

export interface VehicleCategoriesQueryResult {
  categories: VehicleCategory[];
}

export function useQueryVehicleCategories() {
  return useQuery<VehicleCategoriesQueryResult>(CATEGORIES_QUERY);
}
