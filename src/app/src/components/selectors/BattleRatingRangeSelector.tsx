import React from 'react';
import { BrRangeSlider } from '../BrRangeSlider';
import { useLineUpBuilderFilter } from '../../hooks/useLineUpBuilderFilter';

export function BattleRatingRangeSelector(): React.ReactElement {
  const { state, updateBattleRatingRange } = useLineUpBuilderFilter();

  const disabled = !state.gameMode;

  return (
    <BrRangeSlider
      value={state.brRange}
      onChange={updateBattleRatingRange}
      disabled={disabled}
    />
  );
}
