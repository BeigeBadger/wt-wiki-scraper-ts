import * as cheerio from 'cheerio';
import {
  type BattleRatingMode,
  type Vehicle,
  type Country,
  type VehicleCategory,
} from '@shared-types';
import { logDebug, logWarning } from './utils/logger.js';

type CheerioRoot = cheerio.Root;

export const SELECTORS = {
  VEHICLE_ROW: 'tr.wt-ulist_unit--regular',
  NAME: 'td.wt-ulist_unit-name span',
  ROLE: 'td:nth-child(2) span',
  RANK: 'td:nth-child(4)',
  BR: 'td.br',
  COUNTRY: 'td.wt-ulist_unit-country',
} as const;

export interface ParsedTableData {
  vehicles: Map<string, Map<string, Partial<Vehicle>>>;
}

export function getVehicleRows($: CheerioRoot): cheerio.Element[] {
  return $(SELECTORS.VEHICLE_ROW).toArray();
}

export function extractName($: CheerioRoot, row: cheerio.Element): string | null {
  const name = $(row).find(SELECTORS.NAME).text().trim();
  return name || null;
}

export function extractRole($: CheerioRoot, row: cheerio.Element): string | null {
  const role = $(row).find(SELECTORS.ROLE).text().trim();
  return role || null;
}

export function extractRank($: CheerioRoot, row: cheerio.Element): number | null {
  const rankValue = $(row).find(SELECTORS.RANK).attr('data-value');
  if (rankValue) {
    const rank = parseInt(rankValue, 10);
    return isNaN(rank) ? null : rank;
  }
  return null;
}

export function extractBR($: CheerioRoot, row: cheerio.Element): number | null {
  const brText = $(row).find(SELECTORS.BR).text().trim();
  if (brText) {
    const br = parseFloat(brText);
    return isNaN(br) ? null : br;
  }
  return null;
}

export function extractCountry($: CheerioRoot, row: cheerio.Element): string | null {
  const countryValue = $(row).find(SELECTORS.COUNTRY).attr('data-value');
  return countryValue || null;
}

export function parseHtmlTable(
  html: string,
  mode: BattleRatingMode,
  category: VehicleCategory
): ParsedTableData {
  const $ = cheerio.load(html);
  const vehicles = new Map<string, Map<string, Partial<Vehicle>>>();

  const rows = getVehicleRows($);
  logDebug(`Found ${rows.length} vehicle rows for ${category} (${mode})`);

  for (const row of rows) {
    const name = extractName($, row);
    if (!name) {
      logWarning('scraping', 'unknown', category, 'unknown', 'Could not find vehicle name');
      continue;
    }

    const country = extractCountry($, row);
    if (!country) {
      logWarning('scraping', 'unknown', category, name, 'Could not find country');
      continue;
    }

    const countryLower = country.toLowerCase() as Country;

    if (!vehicles.has(countryLower)) {
      vehicles.set(countryLower, new Map());
    }

    const countryVehicles = vehicles.get(countryLower)!;
    const existing = countryVehicles.get(name) || {
      name,
      rank: null,
      battleRating: {
        arcade: null,
        realistic: null,
        simulator: null,
      },
      role: null,
    };

    const role = extractRole($, row);
    if (role && !existing.role) {
      existing.role = role;
    }

    const rank = extractRank($, row);
    if (rank !== null && existing.rank === null) {
      existing.rank = rank;
    }

    const br = extractBR($, row);
    if (br !== null && existing.battleRating) {
      existing.battleRating[mode] = br;
    }

    countryVehicles.set(name, existing);
  }

  return { vehicles };
}

export function mergeVehicleData(
  existing: Map<string, Map<string, Partial<Vehicle>>>,
  newData: Map<string, Map<string, Partial<Vehicle>>>
): Map<string, Map<string, Partial<Vehicle>>> {
  for (const [country, newCountryVehicles] of newData) {
    if (!existing.has(country)) {
      existing.set(country, new Map());
    }

    const existingCountryVehicles = existing.get(country)!;

    for (const [name, newVehicle] of newCountryVehicles) {
      const existingVehicle = existingCountryVehicles.get(name);

      if (existingVehicle) {
        if (newVehicle.role && !existingVehicle.role) {
          existingVehicle.role = newVehicle.role;
        }
        if (newVehicle.rank !== null && existingVehicle.rank === null) {
          existingVehicle.rank = newVehicle.rank;
        }
        if (newVehicle.battleRating && existingVehicle.battleRating) {
          if (newVehicle.battleRating.arcade !== null) {
            existingVehicle.battleRating.arcade = newVehicle.battleRating.arcade;
          }
          if (newVehicle.battleRating.realistic !== null) {
            existingVehicle.battleRating.realistic = newVehicle.battleRating.realistic;
          }
          if (newVehicle.battleRating.simulator !== null) {
            existingVehicle.battleRating.simulator = newVehicle.battleRating.simulator;
          }
        }
      } else {
        existingCountryVehicles.set(name, newVehicle);
      }
    }
  }

  return existing;
}

export function validateAndCleanVehicles(
  vehicles: Map<string, Partial<Vehicle>>,
  country: string,
  category: string,
  subDir: 'scraping' | 'db-population' = 'scraping'
): Vehicle[] {
  const result: Vehicle[] = [];

  for (const [name, partial] of vehicles) {
    const vehicle: Vehicle = {
      name,
      rank: partial.rank ?? null,
      battleRating: {
        arcade: partial.battleRating?.arcade ?? null,
        realistic: partial.battleRating?.realistic ?? null,
        simulator: partial.battleRating?.simulator ?? null,
      },
      role: partial.role ?? null,
    };

    if (vehicle.role === null) {
      logWarning(subDir, country, category, name, 'missing role');
    }
    if (vehicle.rank === null) {
      logWarning(subDir, country, category, name, 'missing rank');
    }
    if (
      vehicle.battleRating.arcade === null &&
      vehicle.battleRating.realistic === null &&
      vehicle.battleRating.simulator === null
    ) {
      logWarning(subDir, country, category, name, 'missing all battle ratings');
    }

    result.push(vehicle);
  }

  return result;
}
