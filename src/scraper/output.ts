import type { Vehicle, CategoryData } from '@shared-types';
import { fileURLToPath } from 'url';
import * as path from 'path';

const scraperDir = path.dirname(fileURLToPath(import.meta.url));

export async function writeOutputFile(
  category: string,
  country: string,
  vehicles: Vehicle[]
): Promise<void> {
  const fs = await import('fs/promises');

  const dataDir = path.join(scraperDir, '../../data', category);
  await fs.mkdir(dataDir, { recursive: true });

  const filename = `${country}.json`;
  const filepath = path.join(dataDir, filename);

  const data: CategoryData = {
    country,
    category,
    vehicles,
  };

  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function saveHtmlToFile(html: string, filename: string): Promise<void> {
  const fs = await import('fs/promises');

  const rawDir = path.join(scraperDir, '../../data', 'raw');
  await fs.mkdir(rawDir, { recursive: true });

  const filepath = path.join(rawDir, filename);

  await fs.writeFile(filepath, html, 'utf-8');
  logDebug(`Saved HTML to ${filepath}`);
}

async function logDebug(message: string): Promise<void> {
  const { logDebug: debugLog } = await import('./utils/logger.js');
  debugLog(message);
}
