import { getContext } from './browser.js';
import {
  type VehicleCategory,
  type BattleRatingMode,
  type Vehicle,
  BR_MODE_IDS,
} from '@shared-types';
import { parseHtmlTable, mergeVehicleData, validateAndCleanVehicles } from './parser.js';
import { logInfo, logDebug, logError } from './utils/logger.js';
import { writeOutputFile, saveHtmlToFile } from './output.js';

const BASE_URL = 'https://wiki.warthunder.com';

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function scrapeCategory(category: VehicleCategory): Promise<void> {
  const context = await getContext();
  const page = await context.newPage();

  const allVehicles = new Map<string, Map<string, Partial<Vehicle>>>();

  try {
    logInfo(`Processing ${category}...`);

    const listUrl = `${BASE_URL}/${category}?v=l`;

    logDebug(`Visiting: ${listUrl}`);

    try {
      await page.goto(listUrl, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (error) {
      logError('scraping', 'all', category, listUrl, `Network error: ${error}`);

      await page.close();

      return;
    }

    for (const mode of ['arcade', 'realistic', 'simulator'] as BattleRatingMode[]) {
      const brId = BR_MODE_IDS[mode];

      if (mode !== 'arcade') {
        logDebug(`Switching to ${mode} mode...`);

        try {
          await page.click('#wt-br-mode-btn');
          await page.waitForSelector('#wt-br-mode-items', { timeout: 5000 });
          await page.click(`#wt-br-mode-items button[data-br-id="${brId}"]`);
          await delay(500);
        } catch (error) {
          logError(
            'scraping',
            'all',
            category,
            page.url(),
            `Failed to switch to ${mode}: ${error}`
          );

          continue;
        }
      }

      const html = await page.content();
      const htmlFilename = `${category}-${mode}.html`;

      await saveHtmlToFile(html, htmlFilename);

      const parsed = parseHtmlTable(html, mode, category);

      mergeVehicleData(allVehicles, parsed.vehicles);
    }

    for (const [country, countryVehicles] of allVehicles) {
      const vehicles = validateAndCleanVehicles(countryVehicles, country, category);

      await writeOutputFile(category, country, vehicles);

      logInfo(`Completed ${country}/${category}: ${vehicles.length} vehicles`);
    }
  } catch (error) {
    logError(
      'scraping',
      'all',
      category,
      page.url() || `${BASE_URL}/${category}`,
      `Unexpected error: ${error}`
    );
  } finally {
    await page.close();
  }
}
