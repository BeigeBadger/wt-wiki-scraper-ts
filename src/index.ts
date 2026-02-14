import { parseArgs } from 'util';
import * as dotenv from 'dotenv';
import { scrapeCategory } from './scraper/scraper.js';
import { closeBrowser } from './scraper/browser.js';
import { populateDatabase, initDatabase } from './scraper/database.js';
import { setVerbose, logInfo, writeLogs } from './utils/logger.js';
import type { VehicleCategory } from './scraper/types.js';

dotenv.config();

export interface CliOptions {
  verbose?: boolean;
  category?: string;
  skipDb?: boolean;
  dbOnly?: boolean;
  dbInit?: boolean;
  help?: boolean;
}

export function parseCliArgs(args: string[]): CliOptions {
  const filteredArgs = args.slice(2);
  const parsed = parseArgs({
    args: filteredArgs,
    options: {
      verbose: {
        type: 'boolean',
        short: 'v',
        default: false,
      },
      category: {
        type: 'string',
        default: 'aviation',
      },
      'skip-db': {
        type: 'boolean',
        default: false,
      },
      'db-only': {
        type: 'boolean',
        default: false,
      },
      'db-init': {
        type: 'boolean',
        default: false,
      },
      help: {
        type: 'boolean',
        default: false,
      },
    },
  }).values;

  return {
    verbose: parsed.verbose,
    category: parsed.category,
    skipDb: parsed['skip-db'],
    dbOnly: parsed['db-only'],
    dbInit: parsed['db-init'],
    help: parsed.help,
  };
}

export async function main(customOptions?: CliOptions): Promise<void> {
  const args = customOptions ?? parseCliArgs(process.argv);

  if (args.help) {
    console.log(`
Usage: npm run scrape -- [options]

Options:
  --verbose, -v      Enable verbose logging (includes DEBUG level)
  --category        Category to scrape (default: aviation)
  --skip-db         Skip database population after scraping
  --db-only         Only populate database, skip scraping
  --db-init         Initialize database connection and exit
  --help            Show this help message

Examples:
  npm run scrape
  npm run scrape -- --verbose
  npm run scrape -- --category aviation
  npm run scrape -- --skip-db
  npm run db:populate
  npm run db:init
    `);
    return;
  }

  if (args.verbose) {
    setVerbose(true);
  }

  const category: VehicleCategory = (args.category || 'aviation') as VehicleCategory;

  if (args.dbInit) {
    await initDatabase();
    return;
  }

  if (args.dbOnly) {
    logInfo('Starting database population...');
    await populateDatabase();
    await writeLogs();
    logInfo('Database population complete!');
    return;
  }

  logInfo('Starting War Thunder Wiki Scraper...');
  logInfo(`Category: ${category}`);

  await scrapeCategory(category);

  await closeBrowser();

  if (!args.skipDb) {
    logInfo('Populating database...');
    await populateDatabase();
  }

  await writeLogs();

  logInfo('Scraping complete!');
}

main().catch(console.error);
