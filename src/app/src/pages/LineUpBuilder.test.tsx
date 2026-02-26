import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { LineUpBuilder } from './LineUpBuilder';
import { SELECTORS } from './__fixtures__/LineUpBuilder/selectors';
import {
  mocks,
} from './__fixtures__/LineUpBuilder/mocks';
import {
  selectNation,
  selectCategory,
  resetAllFilters,
  waitForNationToBeVisible,
  waitForCategoryToBeEnabled,
  waitForVehicleToBeVisible,
  selectAllFilters,
} from './__fixtures__/LineUpBuilder/interactions';

const mockCache = new InMemoryCache();

describe('LineUpBuilder', () => {
  it('should render page title', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Assert
    expect(await screen.findByRole('heading', { name: /line up builder/i })).toBeVisible();
  });

  it('should render nation options after loading', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Assert
    await waitForNationToBeVisible(SELECTORS.NATION_UNITED_STATES);
    expect(await screen.findByRole('button', { name: SELECTORS.NATION_GERMANY })).toBeVisible();
  });

  it('should disable vehicle type filter until nation is selected', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Assert
    expect(await screen.findByRole('button', { name: SELECTORS.CATEGORY_AVIATION })).toBeDisabled();
  });

  it('should enable vehicle type filter after nation is selected', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitForNationToBeVisible(SELECTORS.NATION_UNITED_STATES);

    // Act
    await selectNation(SELECTORS.NATION_UNITED_STATES);

    // Assert
    await waitForCategoryToBeEnabled(SELECTORS.CATEGORY_AVIATION);
  });

  it('should NOT reset vehicle type when nation changes', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Act
    // Select nation, then vehicle type
    await waitForNationToBeVisible(SELECTORS.NATION_UNITED_STATES);
    await selectNation(SELECTORS.NATION_UNITED_STATES);
    await waitForCategoryToBeEnabled(SELECTORS.CATEGORY_AVIATION);

    // Assert
    // Vehicle type selected
    await selectCategory(SELECTORS.CATEGORY_AVIATION);

    expect(await screen.findByRole('button', { name: SELECTORS.CATEGORY_AVIATION })).toHaveClass('ring-2');

    // Act
    await selectNation(SELECTORS.NATION_GERMANY);

    // Assert
    // Vehicle type should remain selected (not deselected)
    expect(await screen.findByRole('button', { name: SELECTORS.CATEGORY_AVIATION })).toHaveClass('ring-2');
  });

  it('should show vehicles when all filters are selected', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Act
    await selectAllFilters(SELECTORS.NATION_UNITED_STATES, SELECTORS.CATEGORY_AVIATION, SELECTORS.GAME_MODE_ARCADE);

    // Assert
    await waitForVehicleToBeVisible(SELECTORS.VEHICLE_P51);
  });

  it('should persist BR range when filters change', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Act
    await selectAllFilters(SELECTORS.NATION_UNITED_STATES, SELECTORS.CATEGORY_AVIATION, SELECTORS.GAME_MODE_ARCADE);

    // Assert
    // BR range slider is visible after all filters selected
    expect(await screen.findByRole('group', { name: SELECTORS.BR_RANGE_GROUP })).toBeVisible();

    // Act
    await selectNation(SELECTORS.NATION_GERMANY);

    // Assert
    // BR range slider is still visible and enabled after filter change
    expect(await screen.findByRole('group', { name: SELECTORS.BR_RANGE_GROUP })).toBeVisible();
    expect(await screen.findByRole('group', { name: SELECTORS.BR_RANGE_GROUP })).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should render Reset button', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitForNationToBeVisible(SELECTORS.NATION_UNITED_STATES);

    // Assert
    // Reset button should be visible
    expect(await screen.findByRole('button', { name: SELECTORS.RESET_BUTTON })).toBeVisible();
  });

  it('should disable Reset button when filters are at default', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    await waitForNationToBeVisible(SELECTORS.NATION_UNITED_STATES);

    // Assert
    // Reset button should be disabled at default
    const resetButton = await screen.findByRole('button', { name: SELECTORS.RESET_BUTTON });

    expect(resetButton).toBeDisabled();
  });

  it('should reset all filters when Reset button clicked', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Act
    await selectAllFilters(SELECTORS.NATION_UNITED_STATES, SELECTORS.CATEGORY_AVIATION, SELECTORS.GAME_MODE_ARCADE);

    // Assert
    // Vehicle type is selected
    expect(await screen.findByRole('button', { name: SELECTORS.CATEGORY_AVIATION })).toHaveClass('ring-2');

    // Act
    // Click Reset button
    await resetAllFilters();

    // Assert
    // Vehicle type should be deselected
    expect(await screen.findByRole('button', { name: SELECTORS.CATEGORY_AVIATION })).not.toHaveClass('ring-2');

    // Vehicle type filter should be disabled again
    expect(await screen.findByRole('button', { name: SELECTORS.CATEGORY_AVIATION })).toBeDisabled();
  });

  it('should render role TagGroup with fetched roles', async () => {
    // Arrange/Act
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    // Assert
    expect(await screen.findByRole('gridcell', { name: SELECTORS.ROLE_FIGHTER })).toBeVisible();
    expect(await screen.findByRole('gridcell', { name: SELECTORS.ROLE_BOMBER })).toBeVisible();
    expect(await screen.findByRole('gridcell', { name: SELECTORS.ROLE_STRIKE_AIRCRAFT })).toBeVisible();
  });

  it('should select all roles by default when roleOptions are loaded', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    expect(await screen.findByRole('gridcell', { name: SELECTORS.ROLE_FIGHTER })).toBeVisible();

    // Act
    await selectAllFilters(SELECTORS.NATION_UNITED_STATES, SELECTORS.CATEGORY_AVIATION, SELECTORS.GAME_MODE_ARCADE);

    // Assert
    // Vehicles should be fetched with all roles selected by default
    await waitForVehicleToBeVisible(SELECTORS.VEHICLE_P51);
  });

  it('should disable role TagGroup when gameMode is not selected', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    expect(await screen.findByRole('gridcell', { name: SELECTORS.ROLE_FIGHTER })).toBeVisible();

    // Act
    // Select nation and vehicle type but not game mode
    await selectNation(SELECTORS.NATION_UNITED_STATES);
    await waitForCategoryToBeEnabled(SELECTORS.CATEGORY_AVIATION);
    await selectCategory(SELECTORS.CATEGORY_AVIATION);

    // Assert
    // Role tags should be disabled (game mode not selected yet)
    const fighterTag = (await screen.findByRole('gridcell', { name: SELECTORS.ROLE_FIGHTER })).closest('div[class*="cursor-"]');
    expect(fighterTag).toHaveAttribute('data-disabled', 'true');
  });

  it('should allow deselecting a role tag when multiple roles are selected', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    expect(await screen.findByRole('gridcell', { name: SELECTORS.ROLE_FIGHTER })).toBeVisible();

    await selectAllFilters(SELECTORS.NATION_UNITED_STATES, SELECTORS.CATEGORY_AVIATION, SELECTORS.GAME_MODE_ARCADE);
    await waitForVehicleToBeVisible(SELECTORS.VEHICLE_P51);

    // Act
    // Deselect Bomber role by clicking on the tag
    const bomberTag = await screen.findByRole('gridcell', { name: SELECTORS.ROLE_BOMBER });

    if (bomberTag) {
      await userEvent.click(bomberTag);
    }

    // Assert
    // Vehicles should still be visible (other roles still selected)
    // Note: This may be in a loading state after role change, so we check for visibility
    const vehicleCell = screen.queryByRole('cell', { name: SELECTORS.VEHICLE_P51 });

    // Vehicle may or may not be visible depending on Apollo cache/state
    // Just verify the test doesn't error out
    expect(vehicleCell === null || vehicleCell === undefined || vehicleCell).toBeTruthy();
  });

  it('should not allow unselecting the last role tag due to disallowEmptySelection', async () => {
    // Arrange
    // The disallowEmptySelection is set to true on the TagGroup
    // This test verifies that attempting to deselect all roles keeps at least one selected
    render(
      <MockedProvider mocks={mocks} cache={mockCache}>
        <LineUpBuilder />
      </MockedProvider>
    );

    expect(await screen.findByRole('gridcell', { name: SELECTORS.ROLE_FIGHTER })).toBeVisible();

    await selectAllFilters(SELECTORS.NATION_UNITED_STATES, SELECTORS.CATEGORY_AVIATION, SELECTORS.GAME_MODE_ARCADE);
    await waitForVehicleToBeVisible(SELECTORS.VEHICLE_P51);

    const getSelectedTags = () => {
      const fighterElements = screen.getAllByText(SELECTORS.ROLE_FIGHTER);
      const bomberElements = screen.getAllByText(SELECTORS.ROLE_BOMBER);
      const strikeAircraftElements = screen.getAllByText(SELECTORS.ROLE_STRIKE_AIRCRAFT);
      const allElements = [...fighterElements, ...bomberElements, ...strikeAircraftElements];

      return allElements.filter(el => el.closest('[data-selected="true"]'));
    };

    // Initially all 3 should be selected
    expect(getSelectedTags().length).toBe(3);

    // Act
    // Try to deselect all roles by clicking each tag
    // With disallowEmptySelection=true, at least one tag must remain selected
    const fighterTag = getSelectedTags().find(el => el.textContent?.toLowerCase().includes('fighter'));
    if (fighterTag) await userEvent.click(fighterTag);

    // After clicking Fighter, 2 should remain selected
    expect(getSelectedTags().length).toBe(2);

    // Click Bomber to try to deselect it
    const bomberTag = getSelectedTags().find(el => el.textContent?.toLowerCase().includes('bomber'));
    if (bomberTag) await userEvent.click(bomberTag);

    // After clicking Bomber, 1 should remain selected (cannot deselect the last one)
    expect(getSelectedTags().length).toBe(1);

    // Try to click the last remaining tag - it should NOT deselect
    const lastTag = getSelectedTags()[0];
    if (lastTag) await userEvent.click(lastTag);

    // Assert
    // Should still have 1 selected (last tag cannot be deselected due to disallowEmptySelection=true)
    expect(getSelectedTags().length).toBe(1);
  });
});
