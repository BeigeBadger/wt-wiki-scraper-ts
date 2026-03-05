import React from 'react';
import { VehicleList } from '../components/VehicleList';
import { LoadingProgress } from '../components/LoadingProgress';
import { useQueryVehicles } from '../hooks/data/useQueryVehicles';
import { useQueryVehicleRoles } from '../hooks/data/useQueryVehicleRoles';
import { useQueryNations } from '../hooks/data/useQueryNations';
import { useQueryVehicleCategories } from '../hooks/data/useQueryVehicleCategories';
import { LineUpBuilderFilterProvider, useLineUpBuilderFilter } from '../hooks/useLineUpBuilderFilter';
import { NationSelector } from '../components/selectors/NationSelector';
import { VehicleTypeSelector } from '../components/selectors/VehicleTypeSelector';
import { GameModeSelector } from '../components/selectors/GameModeSelector';
import { VehicleRoleSelector } from '../components/selectors/VehicleRoleSelector';
import { BattleRatingRangeSelector } from '../components/selectors/BattleRatingRangeSelector';

function ErrorDisplay({ message }: { message: string }): React.ReactElement {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-red-500">{message}</div>
    </div>
  );
}

function FilterSection(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <NationSelector />
      <VehicleTypeSelector />
      <GameModeSelector />
      <VehicleRoleSelector />
      <BattleRatingRangeSelector />
    </div>
  );
}

function VehicleResults(): React.ReactElement | null {
  const { state } = useLineUpBuilderFilter();

  const shouldFetchVehicles = state.nation && state.vehicleType && state.gameMode && state.roles.length > 0;

  const { data: vehiclesData, loading: vehiclesLoading, error: vehiclesError } = useQueryVehicles({
    country: state.nation,
    category: state.vehicleType,
    gameMode: state.gameMode,
    roles: state.roles,
    minBr: shouldFetchVehicles ? state.brRange[0] : undefined,
    maxBr: shouldFetchVehicles ? state.brRange[1] : undefined,
    skip: !shouldFetchVehicles,
  });

  if (!shouldFetchVehicles) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Eligible Vehicles</h2>
      {vehiclesLoading && <LoadingProgress ariaLabel="Loading vehicle data" />}
      {vehiclesError && <ErrorDisplay message={vehiclesError.message} />}
      {vehiclesData?.vehicles && vehiclesData.vehicles.length > 0 && (
        <VehicleList vehicles={vehiclesData.vehicles} />
      )}
      {vehiclesData?.vehicles && vehiclesData.vehicles.length === 0 && (
        <div className="text-gray-500 py-4">No vehicles found for the selected criteria.</div>
      )}
    </div>
  );
}

export function LineUpBuilder(): React.ReactElement {
  const { data: rolesData } = useQueryVehicleRoles();
  const roleOptions = rolesData?.roles ?? [];
  const roleIds = roleOptions.map((r) => r.id);

  return (
    <LineUpBuilderFilterProvider rolesCount={roleIds.length} roleIds={roleIds}>
      <LineUpBuilderContent />
    </LineUpBuilderFilterProvider>
  );
}

function LineUpBuilderContent(): React.ReactElement {
  const { atDefault, resetAll } = useLineUpBuilderFilter();

  const { loading: nationsLoading } = useQueryNations();
  const { loading: categoriesLoading } = useQueryVehicleCategories();
  const { loading: rolesLoading } = useQueryVehicleRoles();

  const isInitialLoading = nationsLoading || categoriesLoading || rolesLoading;

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Line Up Builder</h1>
        <button
          type="button"
          aria-label="Reset Filters"
          onClick={resetAll}
          disabled={atDefault}
          className={`border rounded-lg px-4 py-2 text-sm font-medium ${atDefault
            ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
            : 'border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer'
            }`}
        >
          Reset Filters
        </button>
      </div>
      {isInitialLoading && <LoadingProgress ariaLabel="Loading initial data" />}
      {!isInitialLoading && (
        <>
          <FilterSection />
          <VehicleResults />
        </>
      )}
    </div>
  );
}
