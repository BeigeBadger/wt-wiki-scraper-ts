import React from 'react';
import { useSlider, useSliderThumb, useFocusRing } from 'react-aria';
import { useSliderState } from '@react-stately/slider';
import { useNumberFormatter } from 'react-aria';

interface BrRangeSliderProps {
  minValue?: number;
  maxValue?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  disabled?: boolean;
}

const BR_MIN = 1.0;
const BR_MAX = 11.7;
const BR_STEP = 0.3;

function Thumb({ index, state, trackRef }: { index: number; state: ReturnType<typeof useSliderState>; trackRef: React.RefObject<HTMLDivElement | null> }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { thumbProps, inputProps } = useSliderThumb({ index, trackRef, inputRef }, state);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...thumbProps}
      className={`top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full ${
        state.isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab'
      } ${isFocusVisible ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
      style={{
        position: 'absolute',
        left: `${state.getThumbPercent(index) * 100}%`,
        transform: 'translateX(-50%) translateY(-50%)',
      }}
    >
      <input ref={inputRef} {...inputProps} {...focusProps} className="sr-only" />
    </div>
  );
}

export function BrRangeSlider({
  minValue = BR_MIN,
  maxValue = BR_MAX,
  value,
  onChange,
  disabled = false,
}: BrRangeSliderProps): React.ReactElement {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const numberFormatter = useNumberFormatter({ maximumFractionDigits: 1 });

  const state = useSliderState({
    minValue,
    maxValue,
    step: BR_STEP,
    value,
    onChange: (v) => onChange(v as [number, number]),
    isDisabled: disabled,
    numberFormatter,
    label: 'Battle Rating Range',
  });

  const { groupProps, trackProps, labelProps, outputProps } = useSlider(
    { label: 'Battle Rating Range', isDisabled: disabled },
    state,
    trackRef
  );

  return (
    <div {...groupProps} className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label {...labelProps} className="text-sm font-medium text-gray-700">
          Battle Rating Range
        </label>
        <output {...outputProps} aria-label="Battle rating value" className="text-sm font-medium text-gray-800">
          {state.values.map((v, i) => state.getThumbValueLabel(i)).join(' - ')}
        </output>
      </div>
      <div
        {...trackProps}
        ref={trackRef}
        className={`relative h-2 rounded-full ${state.isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200'}`}
      >
        <div
          className={`absolute h-full rounded-full ${state.isDisabled ? 'bg-gray-400' : 'bg-blue-500'}`}
          style={{
            left: `${state.getThumbPercent(0) * 100}%`,
            width: `${(state.getThumbPercent(1) - state.getThumbPercent(0)) * 100}%`,
          }}
        />
        <Thumb index={0} state={state} trackRef={trackRef} />
        <Thumb index={1} state={state} trackRef={trackRef} />
      </div>
    </div>
  );
}
