import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrRangeSlider } from './BrRangeSlider';

describe('BrRangeSlider', () => {
  it('should render with default values', () => {
    // Arrange/Act
    render(
      <BrRangeSlider value={[1.0, 11.7]} onChange={vi.fn()} />
    );

    // Assert
    expect(screen.getByText('Battle Rating Range')).toBeVisible();
    expect(screen.getByTestId('br-range-slider')).toBeVisible();
  });

  it('should display current values', () => {
    // Arrange/Act
    render(
      <BrRangeSlider value={[3.0, 5.0]} onChange={vi.fn()} />
    );

    // Assert
    // Slider snaps to step increments, so 3.0 becomes 3.1, 5.0 becomes 5.1
    expect(screen.getByText('3.1 - 5.1')).toBeVisible();
  });

  it('should be disabled when disabled prop is true', () => {
    // Arrange/Act
    render(
      <BrRangeSlider value={[1.0, 11.7]} onChange={vi.fn()} disabled={true} />
    );

    // Assert
    // Check that the track has disabled styling
    const track = screen.getByTestId('br-range-slider').querySelector('.bg-gray-100');
    expect(track).toBeInTheDocument();
  });
});
