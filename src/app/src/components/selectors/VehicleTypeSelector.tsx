import React from 'react';
import { FilterCardGroup } from '../FilterCardGroup';
import { useQueryVehicleCategories } from '../../hooks/data/useQueryVehicleCategories';
import { useLineUpBuilderFilter } from '../../hooks/useLineUpBuilderFilter';
import { CATEGORY_ICONS } from './constants';
import type { FilterCardOption } from '../FilterCardGroup';

export function VehicleTypeSelector(): React.ReactElement | null {
  const { state, updateVehicleTypeSelection } = useLineUpBuilderFilter();
  const { data, loading, error } = useQueryVehicleCategories();

  const disabled = !state.nation;

  if (loading) {
    return <div className="text-gray-500 py-2">Loading vehicle types...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-2">Failed to load vehicle types</div>;
  }

  const options: FilterCardOption[] =
    data?.categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: CATEGORY_ICONS[c.id],
    })) ?? [];

  return (
    <FilterCardGroup
      label="Vehicle Type"
      options={options}
      value={state.vehicleType}
      onChange={updateVehicleTypeSelection}
      disabled={disabled}
      minWidth="140px"
    />
  );
}
