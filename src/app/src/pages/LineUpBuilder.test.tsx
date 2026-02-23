import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const ROLES_QUERY = gql`
  query Roles {
    roles {
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
    $roles: [String!]
  ) {
    vehicles(
      country: $country
      category: $category
      gameMode: $gameMode
      minBr: $minBr
      maxBr: $maxBr
      roles: $roles
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
    request: { query: ROLES_QUERY },
    result: {
      data: {
        roles: [
          { id: 'Fighter', name: 'Fighter' },
          { id: 'Bomber', name: 'Bomber' },
          { id: 'Strike aircraft', name: 'Strike Aircraft' },
        ],
      },
    },
  },
  {
    request: {
      query: LINE_UP_VEHICLES,
      variables: { country: 'usa', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Fighter', 'Bomber', 'Strike aircraft'] },
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
      variables: { country: 'germany', category: 'aviation', gameMode: 'arcade', minBr: 1.0, maxBr: 11.7, roles: ['Fighter', 'Bomber', 'Strike aircraft'] },
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
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).toBeDisabled();
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
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));

    // Assert
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
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

    // Act
    // Select nation, then vehicle type
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /aviation/i }));

    // Assert
    // Vehicle type selected
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).toHaveClass('ring-2');
    });

    // Act
    // Change nation
    await userEvent.click(await screen.findByRole('button', { name: /germany/i }));

    // Assert
    // Vehicle type should remain selected (not deselected)
    await waitFor(async () => {
      const aviationCard = await screen.findByRole('button', { name: /aviation/i });
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

    // Act
    // Select all filters
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /aviation/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /arcade/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /arcade/i }));

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

    // Act
    // Select all filters
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /aviation/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /arcade/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /arcade/i }));

    // Assert
    // BR range slider is visible after all filters selected
    await waitFor(async () => {
      expect(await screen.findByRole('group', { name: /battle rating range/i })).toBeVisible();
    });

    // Act
    // Change nation
    await userEvent.click(await screen.findByRole('button', { name: /germany/i }));

    // Assert
    // BR range slider is still visible and enabled after filter change
    await waitFor(async () => {
      expect(await screen.findByRole('group', { name: /battle rating range/i })).toBeVisible();
      expect(await screen.findByRole('group', { name: /battle rating range/i })).not.toHaveAttribute('aria-disabled', 'true');
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

    // Assert
    // Reset button should be visible
    expect(await screen.findByRole('button', { name: /reset filters/i })).toBeVisible();
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

    // Assert
    // Reset button should be disabled at default
    const resetButton = await screen.findByRole('button', { name: /reset filters/i });
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

    // Act
    // Select all filters
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /aviation/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /arcade/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /arcade/i }));

    // Assert
    // Vehicle type is selected
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).toHaveClass('ring-2');
    });

    // Act
    // Click Reset button
    const resetButton = await screen.findByRole('button', { name: /reset filters/i });
    await userEvent.click(resetButton);

    // Assert
    // Vehicle type should be deselected
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toHaveClass('ring-2');
    });

    // Assert
    // Vehicle type filter should be disabled again
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).toBeDisabled();
    });
  });

  it('should render role TagGroup with fetched roles', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Fighter')).toBeVisible();
      expect(screen.getByText('Bomber')).toBeVisible();
      expect(screen.getByText('Strike Aircraft')).toBeVisible();
    });
  });

  it('should select all roles by default when roleOptions are loaded', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Fighter')).toBeVisible();
    });

    // Act
    // Select nation and vehicle type to enable game mode
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /aviation/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /arcade/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /arcade/i }));

    // Assert
    // Vehicles should be fetched with all roles selected by default
    await waitFor(() => {
      expect(screen.getByText('P-51 Mustang')).toBeVisible();
    });
  });

  it('should disable role TagGroup when gameMode is not selected', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Fighter')).toBeVisible();
    });

    // Select nation and vehicle type but not game mode
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /aviation/i }));

    // Assert
    // Role tags should be disabled (game mode not selected yet)
    const fighterTag = screen.getByText('Fighter').closest('div[class*="cursor-"]');
    expect(fighterTag).toHaveAttribute('data-disabled', 'true');
  });

  it('should allow deselecting a role tag when multiple roles are selected', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Fighter')).toBeVisible();
    });

    // Act
    // Select nation, vehicle type, and game mode
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /aviation/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /arcade/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /arcade/i }));

    // Wait for vehicles to load
    await waitFor(() => {
      expect(screen.getByText('P-51 Mustang')).toBeVisible();
    });

    // Act
    // Deselect Bomber role by clicking on the tag (not the label)
    // Use getAllByText to get both the label and tag, and click the one that's not a label
    const bomberElements = screen.getAllByText('Bomber');
    // The tag element (not the label) should be inside a button or have specific class
    const bomberTag = bomberElements.find(el => el.closest('button') || el.parentElement?.getAttribute('role') === 'option');
    if (bomberTag) {
      await userEvent.click(bomberTag);
    }

    // Assert
    // Vehicles should still be visible (other roles still selected)
    await waitFor(() => {
      expect(screen.getByText('P-51 Mustang')).toBeVisible();
    });
  });

  it('should not allow unselecting the last role tag due to disallowEmptySelection', async () => {
    // Arrange
    // The disallowEmptySelection is set to true on the TagGroup
    // This test verifies that attempting to deselect all roles keeps at least one selected
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Fighter')).toBeVisible();
    });

    // Select nation, vehicle type, and game mode
    await userEvent.click(await screen.findByRole('button', { name: /united states/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /aviation/i }));
    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: /arcade/i })).not.toBeDisabled();
    });
    await userEvent.click(await screen.findByRole('button', { name: /arcade/i }));

    // Wait for vehicles to load
    await waitFor(() => {
      expect(screen.getByText('P-51 Mustang')).toBeVisible();
    });

    // Get all role tags initially (they should all have data-selected="true")
    const getSelectedTags = () => screen.getAllByText((content, element) => {
      return element?.getAttribute('data-selected') === 'true';
    });

    // Initially all 3 should be selected
    expect(getSelectedTags().length).toBe(3);

    // Try to deselect all roles by clicking each tag
    // With disallowEmptySelection=true, at least one tag must remain selected
    const fighterTag = screen.getByRole('row', { name: 'Fighter' });
    await userEvent.click(fighterTag);

    // After clicking Fighter, 2 should remain selected
    expect(getSelectedTags().length).toBe(2);

    // Click Bomber to try to deselect it
    const bomberTag = screen.getByRole('row', { name: 'Bomber' });
    await userEvent.click(bomberTag);

    // After clicking Bomber, 1 should remain selected (cannot deselect the last one)
    expect(getSelectedTags().length).toBe(1);

    // Try to click the last remaining tag - it should NOT deselect
    const lastTag = getSelectedTags()[0];
    await userEvent.click(lastTag);

    // Should still have 1 selected (last tag cannot be deselected due to disallowEmptySelection=true)
    expect(getSelectedTags().length).toBe(1);
  });
});
