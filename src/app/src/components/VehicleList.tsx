import React from 'react';

interface VehicleListProps {
  vehicles: Array<{
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
  }>;
}

export function VehicleList({ vehicles }: VehicleListProps): React.ReactElement {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} data-testid={`vehicle-${vehicle.id}`}>
              <td data-testid="vehicle-name">{vehicle.name}</td>
              <td data-testid="vehicle-country">{vehicle.country}</td>
              <td data-testid="vehicle-rank">{vehicle.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
