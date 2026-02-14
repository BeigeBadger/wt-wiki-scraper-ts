import { useQuery, gql } from '@apollo/client';

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

interface Vehicle {
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

function App() {
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
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Country</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Rank</th>
              <th className="border px-4 py-2 text-left">Role</th>
              <th className="border px-4 py-2 text-left">BR (AB/RB/SB)</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr
                key={vehicle.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50' + ' hover:bg-gray-100'}
              >
                <td className="border px-4 py-2">{vehicle.name}</td>
                <td className="border px-4 py-2">{vehicle.country}</td>
                <td className="border px-4 py-2">{vehicle.category}</td>
                <td className="border px-4 py-2">{vehicle.rank}</td>
                <td className="border px-4 py-2">{vehicle.role}</td>
                <td className="border px-4 py-2">
                  {vehicle.battleRating.arcade ?? '-'} / {vehicle.battleRating.realistic ?? '-'} /{' '}
                  {vehicle.battleRating.simulator ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
