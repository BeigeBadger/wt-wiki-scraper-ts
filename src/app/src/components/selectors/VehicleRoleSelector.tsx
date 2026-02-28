import React from 'react';
import { TagGroup, Tag, TagList, composeRenderProps } from 'react-aria-components';
import type { Selection } from 'react-aria-components';
import { useQueryVehicleRoles } from '../../hooks/data/useQueryVehicleRoles';
import { useLineUpBuilderFilter } from '../../hooks/useLineUpBuilderFilter';

export function VehicleRoleSelector(): React.ReactElement | null {
  const { state, updateRolesSelection } = useLineUpBuilderFilter();
  const { data, loading, error } = useQueryVehicleRoles();

  const disabled = !state.gameMode;
  const roleOptions = data?.roles ?? [];

  if (loading) {
    return <div className="text-gray-500 py-2">Loading roles...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-2">Failed to load roles</div>;
  }

  return (
    <>
      <label id="vehicle-role-label" className="block text-sm font-medium text-gray-700 -mb-2">
        Vehicle Role
      </label>
      <TagGroup
        aria-labelledby="vehicle-role-label"
        disallowEmptySelection={true}
        className="flex flex-col gap-2"
        selectionMode="multiple"
        selectedKeys={new Set(state.roles) as Selection}
        onSelectionChange={(keys) => updateRolesSelection([...keys] as string[])}
        disabledKeys={disabled ? roleOptions.map((r: { id: string }) => r.id) : []}
      >
        <TagList className="flex flex-wrap gap-1">
          {roleOptions.map((role: { id: string; name: string }) => (
            <Tag
              key={role.id}
              id={role.id}
              aria-label={role.name}
              className={composeRenderProps(
                '',
                (_, renderProps) =>
                  `cursor-default text-sm font-medium rounded-lg border px-4 py-2 flex items-center max-w-fit transition ${
                    renderProps.isDisabled
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
    </>
  );
}
