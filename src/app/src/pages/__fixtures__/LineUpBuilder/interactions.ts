import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { SELECTORS } from './selectors';

export async function selectNation(name: RegExp) {
  await userEvent.click(await screen.findByRole('button', { name }));
}

export async function selectCategory(name: RegExp) {
  await userEvent.click(await screen.findByRole('button', { name }));
}

export async function selectGameMode(name: RegExp) {
  await userEvent.click(await screen.findByRole('button', { name }));
}

export async function resetAllFilters() {
  await userEvent.click(await screen.findByRole('button', { name: SELECTORS.RESET_BUTTON }));
}

export async function waitForNationToBeVisible(name: RegExp) {
  await waitFor(async () => {
    expect(await screen.findByRole('button', { name })).toBeVisible();
  });
}

export async function waitForCategoryToBeEnabled(name: RegExp) {
  await waitFor(async () => {
    expect(await screen.findByRole('button', { name })).not.toBeDisabled();
  });
}

export async function waitForGameModeToBeEnabled(name: RegExp) {
  await waitFor(async () => {
    expect(await screen.findByRole('button', { name })).not.toBeDisabled();
  });
}

export async function waitForVehicleToBeVisible(name: RegExp) {
  await waitFor(async () => {
    expect(await screen.findByRole('cell', { name })).toBeVisible();
  });
}

export async function selectAllFilters(nation: RegExp, category: RegExp, gameMode: RegExp) {
  await waitForNationToBeVisible(nation);
  await selectNation(nation);
  await waitForCategoryToBeEnabled(category);
  await selectCategory(category);
  await waitForGameModeToBeEnabled(gameMode);
  await selectGameMode(gameMode);
}
