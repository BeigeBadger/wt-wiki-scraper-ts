import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main, parseCliArgs, type CliOptions } from '../index.js';

vi.mock('../scraper.js', () => ({
  scrapeCategory: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../browser.js', () => ({
  closeBrowser: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../database.js', () => ({
  populateDatabase: vi.fn().mockResolvedValue(undefined),
  initDatabase: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../utils/logger.js', () => ({
  setVerbose: vi.fn(),
  logInfo: vi.fn(),
  writeLogs: vi.fn().mockResolvedValue(undefined),
}));

import { scrapeCategory } from '../scraper.js';
import { closeBrowser } from '../browser.js';
import { populateDatabase, initDatabase } from '../database.js';
import { writeLogs } from '../utils/logger.js';

describe('CLI Options', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('parseCliArgs', () => {
    it('should parse --skip-db flag as true', () => {
      // Arrange/Act
      const options = parseCliArgs(['node', 'index.ts', '--skip-db']);

      // Assert
      expect(options.skipDb).toBe(true);
    });

    it('should parse --verbose flag as true', () => {
      // Arrange/Act
      const options = parseCliArgs(['node', 'index.ts', '--verbose']);

      // Assert
      expect(options.verbose).toBe(true);
    });

    it('should parse --db-only flag as true', () => {
      // Arrange/Act
      const options = parseCliArgs(['node', 'index.ts', '--db-only']);

      // Assert
      expect(options.dbOnly).toBe(true);
    });

    it('should parse --db-init flag as true', () => {
      // Arrange/Act
      const options = parseCliArgs(['node', 'index.ts', '--db-init']);

      // Assert
      expect(options.dbInit).toBe(true);
    });

    it('should parse --category flag correctly', () => {
      // Arrange/Act
      const options = parseCliArgs(['node', 'index.ts', '--category', 'helicopters']);

      // Assert
      expect(options.category).toBe('helicopters');
    });

    it('should have default values', () => {
      // Arrange/Act
      const options = parseCliArgs(['node', 'index.ts']);

      // Assert
      expect(options.verbose).toBe(false);
      expect(options.skipDb).toBe(false);
      expect(options.dbOnly).toBe(false);
      expect(options.dbInit).toBe(false);
      expect(options.category).toBe('aviation');
    });
  });

  describe('main with skip-db', () => {
    it('should NOT call populateDatabase when skipDb is true', async () => {
      // Arrange
      const options: CliOptions = {
        skipDb: true,
        verbose: false,
      };

      // Act
      await main(options);

      // Assert
      expect(scrapeCategory).toHaveBeenCalled();
      expect(closeBrowser).toHaveBeenCalled();
      expect(populateDatabase).not.toHaveBeenCalled();
      expect(writeLogs).toHaveBeenCalled();
    });

    it('should call populateDatabase when skipDb is false', async () => {
      // Arrange
      const options: CliOptions = {
        skipDb: false,
        verbose: false,
      };

      // Act
      await main(options);

      // Assert
      expect(scrapeCategory).toHaveBeenCalled();
      expect(closeBrowser).toHaveBeenCalled();
      expect(populateDatabase).toHaveBeenCalled();
      expect(writeLogs).toHaveBeenCalled();
    });
  });

  describe('main with db-only', () => {
    it('should only call populateDatabase and skip scraping when dbOnly is true', async () => {
      // Arrange
      const options: CliOptions = {
        dbOnly: true,
        verbose: false,
      };

      // Act
      await main(options);

      // Assert
      expect(scrapeCategory).not.toHaveBeenCalled();
      expect(closeBrowser).not.toHaveBeenCalled();
      expect(populateDatabase).toHaveBeenCalled();
      expect(writeLogs).toHaveBeenCalled();
    });
  });

  describe('main with db-init', () => {
    it('should only call initDatabase and exit when dbInit is true', async () => {
      // Arrange
      const options: CliOptions = {
        dbInit: true,
        verbose: false,
      };

      // Act
      await main(options);

      // Assert
      expect(initDatabase).toHaveBeenCalled();
      expect(scrapeCategory).not.toHaveBeenCalled();
      expect(populateDatabase).not.toHaveBeenCalled();
    });
  });
});
