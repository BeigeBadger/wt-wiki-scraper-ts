import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { LineUpBuilder } from './LineUpBuilder';
import { gql } from '@apollo/client';

const NATIONS_QUERY = gql`
  query Nations {
    countries {
      id
      name
    }
  }
`;

const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
    }
  }
`;

const LINE_UP_VEHICLES = gql`
  query LineUpVehicles(
    $country: String
    $category: String
    $gameMode: String
    $minBr: Float
    $maxBr: Float
  ) {
    vehicles(
      country: $country
      category: $category
      gameMode: $gameMode
      minBr: $minBr
      maxBr: $maxBr
    ) {
      id
      name
      country
      category
      rank
      role
      battleRating {
        arcade
        realistic
        simulator
      }
    }
  }
`;

const mocks = [
  {
    request: { query: NATIONS_QUERY },
    result: {
      data: {
        countries: [
          { id: 'usa', name: 'United States' },
          { id: 'germany', name: 'Germany' },
        ],
      },
    },
  },
  {
    request: { query: CATEGORIES_QUERY },
    result: {
      data: {
        categories: [
          { id: 'aviation', name: 'Aviation' },
          { id: 'ground', name: 'Ground Vehicles' },
        ],
      },
    },
  },
  {
    request: {
      query: LINE_UP_VEHICLES,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7 },
    },
    result: {
      data: {
        vehicles: [
          {
            id: 'usa-aviation-p-51',
            name: 'P-51 Mustang',
            country: 'usa',
            category: 'aviation',
            rank: 4,
            role: 'Fighter',
            battleRating: { arcade: 4.0, realistic: 4.3, simulator: 4.7 },
          },
        ],
      },
    },
  },
  {
    request: {
      query: LINE_UP_VEHICLES,
      variables: { country: 'germany', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7 },
    },
    result: {
      data: {
        vehicles: [
          {
            id: 'germany-aviation-bf-109',
            name: 'Bf 109 G-2',
            country: 'germany',
            category: 'aviation',
            rank: 3,
            role: 'Fighter',
            battleRating: { arcade: 3.0, realistic: 3.7, simulator: 4.0 },
          },
        ],
      },
    },
  },
];

describe('LineUpBuilder', () => {
  it('should render page title', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Assert
    expect(screen.getByText('Line Up Builder')).toBeVisible();
  });

  it('should render nation options after loading', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeVisible();
    });
    expect(screen.getByText('Germany')).toBeVisible();
  });

  it('should disable vehicle type filter until nation is selected', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).toBeDisabled();
    });
  });

  it('should enable vehicle type filter after nation is selected', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeVisible();
    });

    // Act
    fireEvent.click(screen.getByTestId('filter-card-usa'));

    // Assert
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).not.toBeDisabled();
    });
  });

  it('should NOT reset vehicle type when nation changes', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeVisible();
    });

    // Act - select nation, then vehicle type
    fireEvent.click(screen.getByTestId('filter-card-usa'));
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('filter-card-aviation'));

    // Assert - vehicle type selected
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).toHaveClass('ring-2');
    });

    // Act - change nation
    fireEvent.click(screen.getByTestId('filter-card-germany'));

    // Assert - vehicle type should remain selected (not deselected)
    await waitFor(() => {
      const aviationCard = screen.getByTestId('filter-card-aviation');
      expect(aviationCard).toHaveClass('ring-2');
    });
  });

  it('should show vehicles when all filters are selected', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeVisible();
    });

    // Act - select all filters
    fireEvent.click(screen.getByTestId('filter-card-usa'));
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('filter-card-aviation'));
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-arcade')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('filter-card-arcade'));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('P-51 Mustang')).toBeVisible();
    });
  });

  it('should persist BR range when filters change', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeVisible();
    });

    // Act - select all filters
    fireEvent.click(screen.getByTestId('filter-card-usa'));
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('filter-card-aviation'));
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-arcade')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('filter-card-arcade'));

    // Assert - BR range slider is visible after all filters selected
    await waitFor(() => {
      expect(screen.getByTestId('br-range-slider')).toBeVisible();
    });

    // Act - change nation
    fireEvent.click(screen.getByTestId('filter-card-germany'));

    // Assert - BR range slider is still visible and enabled after filter change
    await waitFor(() => {
      expect(screen.getByTestId('br-range-slider')).toBeVisible();
      expect(screen.getByTestId('br-range-slider')).not.toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('should render Reset button', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeVisible();
    });

    // Assert - Reset button should be visible
    expect(screen.getByTestId('reset-filters-button')).toBeVisible();
    expect(screen.getByText('Reset Filters')).toBeVisible();
  });

  it('should disable Reset button when filters are at default', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeVisible();
    });

    // Assert - Reset button should be disabled at default
    const resetButton = screen.getByTestId('reset-filters-button');
    expect(resetButton).toBeDisabled();
  });

  it('should reset all filters when Reset button clicked', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeVisible();
    });

    // Act - select all filters
    fireEvent.click(screen.getByTestId('filter-card-usa'));
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('filter-card-aviation'));
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-arcade')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('filter-card-arcade'));

    // Assert - vehicle type is selected
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).toHaveClass('ring-2');
    });

    // Act - click Reset button
    const resetButton = screen.getByTestId('reset-filters-button');
    fireEvent.click(resetButton);

    // Assert - vehicle type should be deselected
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).not.toHaveClass('ring-2');
    });

    // Assert - vehicle type filter should be disabled again
    await waitFor(() => {
      expect(screen.getByTestId('filter-card-aviation')).toBeDisabled();
    });
  });
});
