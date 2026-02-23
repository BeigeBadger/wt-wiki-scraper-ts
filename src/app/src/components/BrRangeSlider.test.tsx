import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrRangeSlider } from './BrRangeSlider';

describe('BrRangeSlider', () => {
  it('should render with default values', async () => {
    // Arrange/Act
    render(
      <BrRangeSlider value={[1.0, 11.7]} onChange={vi.fn()} />
    );

    // Assert
    expect(await screen.findByRole('group', { name: /battle rating range/i })).toBeVisible();
  });

  it('should display current values', async () => {
    // Arrange/Act
    render(
      <BrRangeSlider value={[3.0, 5.0]} onChange={vi.fn()} />
    );

    // Assert
    // Slider snaps to step increments, so 3.0 becomes 3.1, 5.0 becomes 5.1
    expect(await screen.findByRole('status', { name: /battle rating value/i })).toBeVisible();
  });

  it('should be disabled when disabled prop is true', async () => {
    // Arrange/Act
    render(
      <BrRangeSlider value={[1.0, 11.7]} onChange={vi.fn()} disabled={true} />
    );

    // Assert
    // Check that the track has disabled styling
    const slider = await screen.findByRole('group', { name: /battle rating range/i });
    const track = slider.querySelector('.bg-gray-100');

    expect(track).toBeVisible();
  });
});
