import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { FilterCardGroup, FilterCardOption } from '../components/FilterCardGroup';
import { BrRangeSlider } from '../components/BrRangeSlider';
import { VehicleList } from '../components/VehicleList';

const LINE_UP_VEHICLES = gql`
  query LineUpVehicles(
    $country: String
    $category: String
    $gameMode: String
    $minBr: Float
    $maxBr: Float
  ) {
    vehicles(
      country: $country
      category: $category
      gameMode: $gameMode
      minBr: $minBr
      maxBr: $maxBr
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

const NATIONS_QUERY = gql`
  query Nations {
    countries {
      id
      name
    }
  }
`;

const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
    }
  }
`;

const NATION_FLAGS: Record<string, string> = {
  usa: '🇺🇸',
  germany: '🇩🇪',
  ussr: '🇷🇺',
  britain: '🇬🇧',
  japan: '🇯🇵',
  italy: '🇮🇹',
  france: '🇫🇷',
  china: '🇨🇳',
  sweden: '🇸🇪',
};

const CATEGORY_ICONS: Record<string, string> = {
  aviation: '✈️',
  helicopters: '🚁',
  ground: '🚗',
  ships: '⛵',
  boats: '🚤',
};

const GAME_MODES: FilterCardOption[] = [
  { id: 'arcade', name: 'Arcade' },
  { id: 'realistic', name: 'Realistic' },
  { id: 'simulator', name: 'Simulator' },
];

const DEFAULT_BR_RANGE: [number, number] = [1.0, 11.7];

type FilterState = {
  nation: string | null;
  vehicleType: string | null;
  gameMode: string | null;
  brRange: [number, number];
};

type FilterAction =
  | { type: 'SET_NATION'; payload: string }
  | { type: 'SET_VEHICLE_TYPE'; payload: string }
  | { type: 'SET_GAME_MODE'; payload: string }
  | { type: 'SET_BR_RANGE'; payload: [number, number] };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_NATION':
      return { nation: action.payload, vehicleType: null, gameMode: null, brRange: DEFAULT_BR_RANGE };
    case 'SET_VEHICLE_TYPE':
      return { ...state, vehicleType: action.payload, gameMode: null, brRange: DEFAULT_BR_RANGE };
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload, brRange: DEFAULT_BR_RANGE };
    case 'SET_BR_RANGE':
      return { ...state, brRange: action.payload };
  }
}

const initialState: FilterState = {
  nation: null,
  vehicleType: null,
  gameMode: null,
  brRange: DEFAULT_BR_RANGE,
};

function Loading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-red-500">{message}</div>
    </div>
  );
}

export function LineUpBuilder(): React.ReactElement {
  const [state, dispatch] = React.useReducer(filterReducer, initialState);

  const { data: nationsData } = useQuery(NATIONS_QUERY);
  const { data: categoriesData } = useQuery(CATEGORIES_QUERY);

  const shouldFetchVehicles = state.nation && state.vehicleType && state.gameMode;

  const { data: vehiclesData, loading: vehiclesLoading, error: vehiclesError } = useQuery(LINE_UP_VEHICLES, {
    variables: {
      country: state.nation,
      category: state.vehicleType,
      gameMode: state.gameMode,
      minBr: shouldFetchVehicles ? state.brRange[0] : undefined,
      maxBr: shouldFetchVehicles ? state.brRange[1] : undefined,
    },
    skip: !shouldFetchVehicles,
  });

  const nationOptions: FilterCardOption[] =
    nationsData?.countries.map((c: { id: string; name: string }) => ({
      id: c.id,
      name: c.name,
      icon: NATION_FLAGS[c.id],
    })) ?? [];

  const categoryOptions: FilterCardOption[] =
    categoriesData?.categories.map((c: { id: string; name: string }) => ({
      id: c.id,
      name: c.name,
      icon: CATEGORY_ICONS[c.id],
    })) ?? [];

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Line Up Builder</h1>

      <div className="flex flex-col gap-4">
        <FilterCardGroup
          label="Nation"
          options={nationOptions}
          value={state.nation}
          onChange={(id) => dispatch({ type: 'SET_NATION', payload: id })}
        />

        <FilterCardGroup
          label="Vehicle Type"
          options={categoryOptions}
          value={state.vehicleType}
          onChange={(id) => dispatch({ type: 'SET_VEHICLE_TYPE', payload: id })}
          disabled={!state.nation}
        />

        <FilterCardGroup
          label="Game Mode"
          options={GAME_MODES}
          value={state.gameMode}
          onChange={(id) => dispatch({ type: 'SET_GAME_MODE', payload: id })}
          disabled={!state.vehicleType}
        />

        <BrRangeSlider
          value={state.brRange}
          onChange={(range) => dispatch({ type: 'SET_BR_RANGE', payload: range })}
          disabled={!state.gameMode}
        />
      </div>

      {shouldFetchVehicles && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Eligible Vehicles</h2>
          {vehiclesLoading && <Loading />}
          {vehiclesError && <ErrorDisplay message={vehiclesError.message} />}
          {vehiclesData?.vehicles && vehiclesData.vehicles.length > 0 && (
            <VehicleList vehicles={vehiclesData.vehicles} />
          )}
          {vehiclesData?.vehicles && vehiclesData.vehicles.length === 0 && (
            <div className="text-gray-500 py-4">No vehicles found for the selected criteria.</div>
          )}
        </div>
      )}
    </div>
  );
}
