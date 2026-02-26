import { gql } from '@apollo/client';

export const NATIONS_QUERY = gql`
  query Nations {
    countries {
      id
      name
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
    }
  }
`;

export const ROLES_QUERY = gql`
  query Roles {
    roles {
      id
      name
    }
  }
`;

export const LINE_UP_VEHICLES = gql`
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
      query: LINE_UP_VEHICLES,
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
      query: LINE_UP_VEHICLES,
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
      query: LINE_UP_VEHICLES,
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
      query: LINE_UP_VEHICLES,
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
      query: LINE_UP_VEHICLES,
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
      query: LINE_UP_VEHICLES,
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
      query: LINE_UP_VEHICLES,
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
      query: LINE_UP_VEHICLES,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Strike aircraft'] },
    },
    result: {
      data: {
        vehicles: [P51_MUSTANG_VEHICLE],
      },
    },
  },
];
