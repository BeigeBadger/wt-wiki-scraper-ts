# Server

Express + Apollo GraphQL server that serves vehicle data from MongoDB.

## Environment Variables

```bash
MONGO_URI=mongodb://localhost:27017
MONGO_DB=warthunder
PORT=4000
```

## Getting Started

```bash
cd src/server
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## GraphQL Endpoint

```
http://localhost:4000/graphql
```

## Schema

```graphql
type Query {
  vehicles(country: String, category: String, gameMode: String): [Vehicle!]!
  vehicle(id: ID!): Vehicle
  countries: [Country!]!
  categories: [VehicleCategory!]!
}

type Vehicle {
  id: ID!
  name: String!
  country: String!
  category: String!
  rank: Int
  role: String
  battleRating: BattleRating!
}

type BattleRating {
  arcade: Float
  realistic: Float
  simulator: Float
}

type Country {
  id: String!
  name: String!
}

type VehicleCategory {
  id: String!
  name: String!
}
```
