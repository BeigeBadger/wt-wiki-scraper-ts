import { ApolloError } from '@apollo/client';
import { VehicleList } from '../components/VehicleList';
import { LoadingProgress } from '../components/LoadingProgress';
import { useQueryVehicles, Vehicle } from '../hooks/data/useQueryVehicles';

const ErrorOnLoadComplete = ({ error }: { error: ApolloError | undefined }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <p className="text-lg text-red-600">Error: {error?.message}</p>
    <p className="mt-2 text-sm text-gray-600">
      Make sure MongoDB is running and the scraper has populated the database.
    </p>
  </div>
);

const NoDataAvailable = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <p className="text-lg">No data available.</p>
    <p className="mt-2 text-sm text-gray-600">Run the scraper to populate the database.</p>
  </div>
);

const TitleAndVehicleCount = ({ vehicles }: { vehicles: Vehicle[] }) => (
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold">War Thunder Vehicles</h1>
    <p className="text-gray-600">Total: {vehicles.length} vehicles</p>
  </div>
);

export function Vehicles() {
  const { loading, error, data } = useQueryVehicles();
  const vehicles = data ? [...data.vehicles].sort((a, b) => a.name.localeCompare(b.name)) : [];

  if (loading) {
    return <LoadingProgress ariaLabel="Loading vehicle data" />
  }

  if (error) {
    return <ErrorOnLoadComplete error={error} />
  }

  if (!data || vehicles.length === 0) {
    return <NoDataAvailable />
  }

  return (
    <div className="p-8">
      <TitleAndVehicleCount vehicles={vehicles} />

      <VehicleList vehicles={vehicles} />
    </div>
  );
}
