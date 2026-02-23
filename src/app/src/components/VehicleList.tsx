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
    <div className="overflow-x-auto">
      <table aria-label="Vehicle list" className="min-w-full border border-gray-300">
        <thead aria-label="Vehicle list header" className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Country</th>
            <th className="border px-4 py-2 text-left">Category</th>
            <th className="border px-4 py-2 text-left">Rank</th>
            <th className="border px-4 py-2 text-left">Role</th>
            <th className="border px-4 py-2 text-left">BR (AB/RB/SB)</th>
          </tr>
        </thead>
        <tbody aria-label="Vehicle list body">
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
  );
}
