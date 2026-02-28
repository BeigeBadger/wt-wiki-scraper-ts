import { NATIONS_QUERY } from '../../../hooks/data/useQueryNations';
import { CATEGORIES_QUERY } from '../../../hooks/data/useQueryVehicleCategories';
import { ROLES_QUERY } from '../../../hooks/data/useQueryVehicleRoles';
import { GET_VEHICLES_QUERY } from '../../../hooks/data/useQueryVehicles';

export const P51_MUSTANG_VEHICLE = {
  __typename: 'Vehicle',
  id: 'usa-aviation-p-51',
  name: 'P-51 Mustang',
  country: 'usa',
  category: 'aviation',
  rank: 4,
  role: 'Fighter',
  battleRating: { __typename: 'BattleRating', arcade: 4.0, realistic: 4.3, simulator: 4.7 },
};

export const BF109_VEHICLE = {
  __typename: 'Vehicle',
  id: 'germany-aviation-bf-109',
  name: 'Bf 109 G-2',
  country: 'germany',
  category: 'aviation',
  rank: 3,
  role: 'Fighter',
  battleRating: { __typename: 'BattleRating', arcade: 3.0, realistic: 3.7, simulator: 4.0 },
};

export const mocks = [
  {
    request: { query: NATIONS_QUERY },
    result: {
      data: {
        countries: [
          { __typename: 'Country', id: 'usa', name: 'United States' },
          { __typename: 'Country', id: 'germany', name: 'Germany' },
        ],
      },
    },
  },
  {
    request: { query: CATEGORIES_QUERY },
    result: {
      data: {
        categories: [
          { __typename: 'Category', id: 'aviation', name: 'Aviation' },
          { __typename: 'Category', id: 'ground', name: 'Ground Vehicles' },
        ],
      },
    },
  },
  {
    request: { query: ROLES_QUERY },
    result: {
      data: {
        roles: [
          { __typename: 'Role', id: 'Fighter', name: 'Fighter' },
          { __typename: 'Role', id: 'Bomber', name: 'Bomber' },
          { __typename: 'Role', id: 'Strike aircraft', name: 'Strike Aircraft' },
        ],
      },
    },
  },
  {
    request: {
      query: GET_VEHICLES_QUERY,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Fighter', 'Bomber', 'Strike aircraft'] },
    },
    result: {
      data: {
        vehicles: [P51_MUSTANG_VEHICLE],
      },
    },
  },
  {
    request: {
      query: GET_VEHICLES_QUERY,
      variables: { country: 'germany', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Fighter', 'Bomber', 'Strike aircraft'] },
    },
    result: {
      data: {
        vehicles: [BF109_VEHICLE],
      },
    },
  },
  {
    request: {
      query: GET_VEHICLES_QUERY,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Fighter', 'Strike aircraft'] },
    },
    result: {
      data: {
        vehicles: [P51_MUSTANG_VEHICLE],
      },
    },
  },
  {
    request: {
      query: GET_VEHICLES_QUERY,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Fighter', 'Bomber'] },
    },
    result: {
      data: {
        vehicles: [P51_MUSTANG_VEHICLE],
      },
    },
  },
  {
    request: {
      query: GET_VEHICLES_QUERY,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Bomber', 'Strike aircraft'] },
    },
    result: {
      data: {
        vehicles: [P51_MUSTANG_VEHICLE],
      },
    },
  },
  {
    request: {
      query: GET_VEHICLES_QUERY,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Fighter'] },
    },
    result: {
      data: {
        vehicles: [P51_MUSTANG_VEHICLE],
      },
    },
  },
  {
    request: {
      query: GET_VEHICLES_QUERY,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Bomber'] },
    },
    result: {
      data: {
        vehicles: [],
      },
    },
  },
  {
    request: {
      query: GET_VEHICLES_QUERY,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Strike aircraft'] },
    },
    result: {
      data: {
        vehicles: [P51_MUSTANG_VEHICLE],
      },
    },
  },
];
