import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { FilterCardGroup, FilterCardOption } from '../components/FilterCardGroup';
import { BrRangeSlider } from '../components/BrRangeSlider';
import { VehicleList } from '../components/VehicleList';
import { TagGroup, Tag, TagList, composeRenderProps } from 'react-aria-components';
import type { Selection } from 'react-aria-components';

const LINE_UP_VEHICLES = gql`
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

const ROLES_QUERY = gql`
  query Roles {
    roles {
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
  roles: string[];
  brRange: [number, number];
};

type FilterAction =
  | { type: 'SET_NATION'; payload: string }
  | { type: 'SET_VEHICLE_TYPE'; payload: string }
  | { type: 'SET_GAME_MODE'; payload: string }
  | { type: 'SET_ROLES'; payload: string[] }
  | { type: 'SET_BR_RANGE'; payload: [number, number] }
  | { type: 'RESET_ALL' };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_NATION':
      return { ...state, nation: action.payload };
    case 'SET_VEHICLE_TYPE':
      return { ...state, vehicleType: action.payload };
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'SET_ROLES':
      return { ...state, roles: action.payload };
    case 'SET_BR_RANGE':
      return { ...state, brRange: action.payload };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}

function isAtDefault(state: FilterState, rolesCount: number): boolean {
  return (
    state.nation === null &&
    state.vehicleType === null &&
    state.gameMode === null &&
    state.roles.length === rolesCount &&
    state.brRange[0] === DEFAULT_BR_RANGE[0] &&
    state.brRange[1] === DEFAULT_BR_RANGE[1]
  );
}

const initialState: FilterState = {
  nation: null,
  vehicleType: null,
  gameMode: null,
  roles: [],
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
  const { data: rolesData } = useQuery(ROLES_QUERY);

  const roleOptions = rolesData?.roles ?? [];

  React.useEffect(() => {
    if (roleOptions.length > 0 && state.roles.length === 0) {
      dispatch({ type: 'SET_ROLES', payload: roleOptions.map((r: { id: string }) => r.id) });
    }
  }, [roleOptions]);

  const shouldFetchVehicles = state.nation && state.vehicleType && state.gameMode && state.roles.length > 0;

  const { data: vehiclesData, loading: vehiclesLoading, error: vehiclesError } = useQuery(LINE_UP_VEHICLES, {
    variables: {
      country: state.nation,
      category: state.vehicleType,
      gameMode: state.gameMode,
      roles: state.roles,
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

  const atDefault = isAtDefault(state, roleOptions.length);

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Line Up Builder</h1>
        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET_ALL' })}
          disabled={atDefault}
          className={`border rounded-lg px-4 py-2 text-sm font-medium ${atDefault
              ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer'
            }`}
        >
          Reset Filters
        </button>
      </div>

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

        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Role</label>
        <TagGroup
          disallowEmptySelection={true}
          className="flex flex-col gap-2"
          selectionMode="multiple"
          selectedKeys={new Set(state.roles) as Selection}
          onSelectionChange={(keys) =>
            dispatch({ type: 'SET_ROLES', payload: [...keys] as string[] })
          }
          disabledKeys={!state.gameMode ? roleOptions.map((r: { id: string }) => r.id) : []}
        >
          <TagList className="flex flex-wrap gap-1">
            {roleOptions.map((role: { id: string; name: string }) => (
              <Tag
                key={role.id}
                id={role.id}
                className={composeRenderProps(
                  '',
                  (_, renderProps) =>
                    `cursor-default text-sm font-medium rounded-lg border px-4 py-2 flex items-center max-w-fit transition ${renderProps.isDisabled
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : renderProps.isSelected
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400'
                    }`
                )}
              >
                {role.name}
              </Tag>
            ))}
          </TagList>
        </TagGroup>

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
