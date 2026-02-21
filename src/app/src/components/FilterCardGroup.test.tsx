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

  it('should render label and all options', async () => {
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
    expect(await screen.findByText('Nation')).toBeVisible();
    expect(await screen.findByText('USA')).toBeVisible();
    expect(await screen.findByText('Germany')).toBeVisible();
    expect(await screen.findByText('USSR')).toBeVisible();
  });

  it('should highlight selected option', async () => {
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
    const selectedCard = await screen.findByRole('button', { name: 'Germany' });
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
    await userEvent.click(await screen.findByRole('button', { name: 'Germany' }));

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
    await userEvent.click(await screen.findByRole('button', { name: 'Germany' }));

    // Assert
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should show disabled styling when disabled', async () => {
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
    const card = await screen.findByRole('button', { name: 'USA' });
    expect(card).toHaveClass('opacity-50');
    expect(card).toBeDisabled();
  });
});
