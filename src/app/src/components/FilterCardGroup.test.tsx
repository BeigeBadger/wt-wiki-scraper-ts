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
        onChange={() => { }}
      />
    );

    // Assert
    expect(await screen.findByLabelText(/nation/i)).toBeVisible();
    expect(await screen.findByRole('button', { name: /usa/i })).toBeVisible();
    expect(await screen.findByRole('button', { name: /germany/i })).toBeVisible();
    expect(await screen.findByRole('button', { name: /ussr/i })).toBeVisible();
  });

  it('should highlight selected option', async () => {
    // Arrange/Act
    render(
      <FilterCardGroup
        label="Nation"
        options={defaultOptions}
        value="germany"
        onChange={() => { }}
      />
    );

    // Assert
    const selectedCard = await screen.findByRole('button', { name: /germany/i });

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
    await userEvent.click(await screen.findByRole('button', { name: /germany/i }));

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
    await userEvent.click(await screen.findByRole('button', { name: /germany/i }));

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
        onChange={() => { }}
        disabled={true}
      />
    );

    // Assert
    const card = await screen.findByRole('button', { name: /usa/i });

    expect(card).toHaveClass('opacity-50');
    expect(card).toBeDisabled();
  });

  it('should apply custom minWidth when provided', async () => {
    // Arrange/Act
    render(
      <FilterCardGroup
        label="Nation"
        options={defaultOptions}
        value={null}
        onChange={() => { }}
        minWidth="150px"
      />
    );

    // Assert
    const card = await screen.findByRole('button', { name: /usa/i });

    expect(card).toHaveStyle({ minWidth: '150px' });
  });

  it('should default minWidth to 100px when not provided', async () => {
    // Arrange/Act
    render(
      <FilterCardGroup
        label="Nation"
        options={defaultOptions}
        value={null}
        onChange={() => { }}
      />
    );

    // Assert
    const card = await screen.findByRole('button', { name: /usa/i });

    expect(card).toHaveStyle({ minWidth: '100px' });
  });
});
