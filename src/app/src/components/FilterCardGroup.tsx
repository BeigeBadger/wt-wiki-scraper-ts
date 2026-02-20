import React from 'react';

export interface FilterCardOption {
  id: string;
  name: string;
  icon?: string;
}

interface FilterCardGroupProps {
  label: string;
  options: FilterCardOption[];
  value: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export function FilterCardGroup({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: FilterCardGroupProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.id)}
              data-testid={`filter-card-${option.id}`}
              className={[
                'flex flex-col items-center justify-center',
                'border rounded-lg px-4 py-3 min-w-[80px]',
                'transition-colors duration-150',
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:border-gray-400',
                isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                  : 'border-gray-200 bg-white',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {option.icon && (
                <span className="text-2xl mb-1" role="img" aria-hidden="true">
                  {option.icon}
                </span>
              )}
              <span className="text-sm font-medium text-gray-800">{option.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
