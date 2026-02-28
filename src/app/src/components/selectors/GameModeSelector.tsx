import React from 'react';
import { FilterCardGroup } from '../FilterCardGroup';
import { useLineUpBuilderFilter } from '../../hooks/useLineUpBuilderFilter';
import { GAME_MODES } from './constants';

export function GameModeSelector(): React.ReactElement {
  const { state, updateGameModeSelection } = useLineUpBuilderFilter();

  const disabled = !state.vehicleType;

  return (
    <FilterCardGroup
      label="Game Mode"
      options={GAME_MODES}
      value={state.gameMode}
      onChange={updateGameModeSelection}
      disabled={disabled}
    />
  );
}
