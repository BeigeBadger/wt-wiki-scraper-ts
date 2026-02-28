import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';
import { DEFAULT_BR_RANGE } from '../components/selectors/constants';

export type FilterState = {
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

const initialState: FilterState = {
  nation: null,
  vehicleType: null,
  gameMode: null,
  roles: [],
  brRange: DEFAULT_BR_RANGE,
};

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

type LineUpBuilderFilterContextType = {
  state: FilterState;
  atDefault: boolean;
  rolesCount: number;
  updateNationSelection: (id: string) => void;
  updateVehicleTypeSelection: (id: string) => void;
  updateGameModeSelection: (id: string) => void;
  updateRolesSelection: (roles: string[]) => void;
  updateBattleRatingRange: (range: [number, number]) => void;
  resetAll: () => void;
};

const LineUpBuilderFilterContext = createContext<LineUpBuilderFilterContextType | null>(null);

interface LineUpBuilderFilterProviderProps {
  children: React.ReactNode;
  rolesCount: number;
  roleIds?: string[];
}

export function LineUpBuilderFilterProvider({
  children,
  rolesCount,
  roleIds,
}: LineUpBuilderFilterProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const hasInitializedRoles = React.useRef(false);

  useEffect(() => {
    if (!hasInitializedRoles.current && roleIds && roleIds.length > 0 && rolesCount > 0) {
      dispatch({ type: 'SET_ROLES', payload: roleIds });
      hasInitializedRoles.current = true;
    }
  }, [roleIds, rolesCount]);

  const atDefault = useMemo(() => isAtDefault(state, rolesCount), [state, rolesCount]);

  const updateNationSelection = useCallback((id: string) => {
    dispatch({ type: 'SET_NATION', payload: id });
  }, []);

  const updateVehicleTypeSelection = useCallback((id: string) => {
    dispatch({ type: 'SET_VEHICLE_TYPE', payload: id });
  }, []);

  const updateGameModeSelection = useCallback((id: string) => {
    dispatch({ type: 'SET_GAME_MODE', payload: id });
  }, []);

  const updateRolesSelection = useCallback((roles: string[]) => {
    dispatch({ type: 'SET_ROLES', payload: roles });
  }, []);

  const updateBattleRatingRange = useCallback((range: [number, number]) => {
    dispatch({ type: 'SET_BR_RANGE', payload: range });
  }, []);

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      atDefault,
      rolesCount,
      updateNationSelection,
      updateVehicleTypeSelection,
      updateGameModeSelection,
      updateRolesSelection,
      updateBattleRatingRange,
      resetAll,
    }),
    [
      state,
      atDefault,
      rolesCount,
      updateNationSelection,
      updateVehicleTypeSelection,
      updateGameModeSelection,
      updateRolesSelection,
      updateBattleRatingRange,
      resetAll,
    ]
  );

  return (
    <LineUpBuilderFilterContext.Provider value={value}>
      {children}
    </LineUpBuilderFilterContext.Provider>
  );
}

export function useLineUpBuilderFilter(): LineUpBuilderFilterContextType {
  const context = useContext(LineUpBuilderFilterContext);
  if (!context) {
    throw new Error('useLineUpBuilderFilter must be used within a LineUpBuilderFilterProvider');
  }
  return context;
}
