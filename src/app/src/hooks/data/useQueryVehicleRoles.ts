import { gql, useQuery } from '@apollo/client';

export const ROLES_QUERY = gql`
  query Roles {
    roles {
      id
      name
    }
  }
`;

export interface VehicleRole {
  id: string;
  name: string;
}

export interface VehicleRolesQueryResult {
  roles: VehicleRole[];
}

export function useQueryVehicleRoles() {
  return useQuery<VehicleRolesQueryResult>(ROLES_QUERY);
}
