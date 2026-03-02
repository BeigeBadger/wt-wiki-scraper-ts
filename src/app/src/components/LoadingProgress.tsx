import { useProgressBar } from '@react-aria/progress';

interface LoadingProgressProps {
  ariaLabel: string;
  size?: 'S' | 'M' | 'L';
}

const sizeMap = {
  S: { size: 16, strokeWidth: 2 },
  M: { size: 24, strokeWidth: 3 },
  L: { size: 32, strokeWidth: 4 },
};

export function LoadingProgress({ ariaLabel, size = 'L' }: LoadingProgressProps): React.ReactElement {
  const { size: dimension, strokeWidth } = sizeMap[size];
  const { progressBarProps } = useProgressBar({
    'aria-label': ariaLabel,
    isIndeterminate: true,
  });

  const center = dimension / 2;
  const r = center - strokeWidth;
  const circumference = 2 * r * Math.PI;
  const offset = circumference * 0.25;

  return (
    <div className="flex items-center justify-center py-8">
      <svg
        {...progressBarProps}
        role="progressbar"
        aria-label={ariaLabel}
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="animate-spin"
      >
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="opacity-25"
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
