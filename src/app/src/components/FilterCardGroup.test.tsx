import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FilterCardGroup, FilterCardOption } from './FilterCardGroup';

describe('FilterCardGroup', () => {
  const defaultOptions: FilterCardOption[] = [
    { id: 'usa', name: 'USA', icon: '🇺🇸' },
    { id: 'germany', name: 'Germany', icon: '🇩🇪' },
    { id: 'ussr', name: 'USSR', icon: '🇷🇺' },
  ];

  it('should render label and all options', () => {
    // Arrange/Act
    render(
      <FilterCardGroup
        label="Nation"
        options={defaultOptions}
        value={null}
        onChange={() => {}}
      />
    );

    // Assert
    expect(screen.getByText('Nation')).toBeVisible();
    expect(screen.getByText('USA')).toBeVisible();
    expect(screen.getByText('Germany')).toBeVisible();
    expect(screen.getByText('USSR')).toBeVisible();
  });

  it('should highlight selected option', () => {
    // Arrange/Act
    render(
      <FilterCardGroup
        label="Nation"
        options={defaultOptions}
        value="germany"
        onChange={() => {}}
      />
    );

    // Assert
    const selectedCard = screen.getByTestId('filter-card-germany');
    expect(selectedCard).toHaveClass('ring-2');
    expect(selectedCard).toHaveClass('ring-blue-500');
  });

  it('should call onChange when option is clicked', async () => {
    // Arrange
    const handleChange = vi.fn();
    render(
      <FilterCardGroup
        label="Nation"
        options={defaultOptions}
        value={null}
        onChange={handleChange}
      />
    );

    // Act
    await userEvent.click(screen.getByTestId('filter-card-germany'));

    // Assert
    expect(handleChange).toHaveBeenCalledWith('germany');
  });

  it('should not call onChange when disabled', async () => {
    // Arrange
    const handleChange = vi.fn();
    render(
      <FilterCardGroup
        label="Nation"
        options={defaultOptions}
        value={null}
        onChange={handleChange}
        disabled={true}
      />
    );

    // Act
    await userEvent.click(screen.getByTestId('filter-card-germany'));

    // Assert
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should show disabled styling when disabled', () => {
    // Arrange/Act
    render(
      <FilterCardGroup
        label="Nation"
        options={defaultOptions}
        value={null}
        onChange={() => {}}
        disabled={true}
      />
    );

    // Assert
    const card = screen.getByTestId('filter-card-usa');
    expect(card).toHaveClass('opacity-50');
    expect(card).toBeDisabled();
  });
});
