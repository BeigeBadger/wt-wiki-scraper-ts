import { useQuery, gql } from '@apollo/client';
import { VehicleList } from '../components/VehicleList';

const GET_VEHICLES = gql`
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

export interface Vehicle {
  id: string;
  name: string;
  country: string;
  category: string;
  rank: number | null;
  role: string | null;
  battleRating: {
    arcade: number | null;
    realistic: number | null;
    simulator: number | null;
  };
}

export function Vehicles() {
  const { loading, error, data } = useQuery<{ vehicles: Vehicle[] }>(GET_VEHICLES);
  const vehicles = data ? [...data.vehicles].sort((a, b) => a.name.localeCompare(b.name)) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Error: {error.message}</p>
        <p className="mt-2 text-sm text-gray-600">
          Make sure MongoDB is running and the scraper has populated the database.
        </p>
      </div>
    );
  }

  if (!data || vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg">No data available.</p>
        <p className="mt-2 text-sm text-gray-600">Run the scraper to populate the database.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">War Thunder Vehicles</h1>
        <p className="text-gray-600">Total: {vehicles.length} vehicles</p>
      </div>
      <VehicleList vehicles={vehicles} />
    </div>
  );
}
