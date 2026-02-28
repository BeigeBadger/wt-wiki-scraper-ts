import React from 'react';
import { FilterCardGroup } from '../FilterCardGroup';
import { useQueryNations } from '../../hooks/data/useQueryNations';
import { useLineUpBuilderFilter } from '../../hooks/useLineUpBuilderFilter';
import { NATION_FLAGS } from './constants';
import type { FilterCardOption } from '../FilterCardGroup';

export function NationSelection(): React.ReactElement | null {
  const { state, updateNationSelection } = useLineUpBuilderFilter();
  const { data, loading, error } = useQueryNations();

  if (loading) {
    return <div className="text-gray-500 py-2">Loading nations...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-2">Failed to load nations</div>;
  }

  const options: FilterCardOption[] =
    data?.countries.map((c) => ({
      id: c.id,
      name: c.name,
      icon: NATION_FLAGS[c.id],
    })) ?? [];

  return (
    <FilterCardGroup
      label="Nation"
      options={options}
      value={state.nation}
      onChange={updateNationSelection}
    />
  );
}
