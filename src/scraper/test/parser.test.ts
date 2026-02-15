import { describe, it, expect } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';
import {
  getVehicleRows,
  extractName,
  extractRole,
  extractRank,
  extractBR,
  extractCountry,
  parseHtmlTable,
  cleanVehicleName,
} from '../parser.js';

const FIXTURES_DIR = path.join(process.cwd(), 'test', 'fixtures');

describe('parser', () => {
  describe('AB fixture', () => {
    it('should find vehicle rows in aviation AB fixture', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-ab.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);

      // Assert
      expect(rows.length).toBeGreaterThan(0);
    }, 10000);

    it('should extract vehicle name from table row', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-ab.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);

      // Assert
      expect(rows.length).toBeGreaterThan(0);

      const name = extractName($, rows[0]);

      expect(name).toBeDefined();
    }, 10000);

    it('should extract role from table row', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-ab.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);

      // Assert
      expect(rows.length).toBeGreaterThan(0);

      const role = extractRole($, rows[0]);

      expect(role).toBeDefined();
    }, 10000);

    it('should extract rank from table row', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-ab.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);

      // Assert
      expect(rows.length).toBeGreaterThan(0);

      const rank = extractRank($, rows[0]);

      expect(rank).toBeDefined();
    }, 10000);

    it('should extract BR from table row', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-ab.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);

      // Assert
      expect(rows.length).toBeGreaterThan(0);

      const br = extractBR($, rows[0]);

      expect(br).toBeDefined();
    }, 10000);

    it('should extract country from table row', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-ab.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);

      // Assert
      expect(rows.length).toBeGreaterThan(0);

      const country = extractCountry($, rows[0]);

      expect(country).toBeDefined();
    }, 10000);
  });

  describe('RB fixture', () => {
    it('should find vehicle rows in aviation RB fixture', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-rb.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);

      // Assert
      expect(rows.length).toBeGreaterThan(0);
    }, 10000);

    it('should parse table with parseHtmlTable', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-rb.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const result = parseHtmlTable(html, 'realistic', 'aviation');

      // Assert
      expect(result.vehicles.size).toBeGreaterThan(0);
    }, 10000);
  });

  describe('SB fixture', () => {
    it('should find vehicle rows in aviation SB fixture', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-sb.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);

      // Assert
      expect(rows.length).toBeGreaterThan(0);
    }, 10000);

    it('should parse table with parseHtmlTable', async () => {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-sb.html');

      const html = await fs.readFile(fixturePath, 'utf-8');

      // Act
      const result = parseHtmlTable(html, 'simulator', 'aviation');

      // Assert
      expect(result.vehicles.size).toBeGreaterThan(0);
    }, 10000);
  });

  describe('cleanVehicleName', () => {
    it('should replace Unicode prefix character using row country', () => {
      // Arrange
      const name = '␗A6M2';

      // Act
      const result = cleanVehicleName(name, 'china');

      // Assert
      expect(result).toBe('[China]A6M2');
    });

    it('should replace USA prefix character with [USA]', () => {
      // Arrange
      const name = '▃Bf 109 F-4';

      // Act
      const result = cleanVehicleName(name, 'usa');

      // Assert
      expect(result).toBe('[USA]Bf 109 F-4');
    });

    it('should replace Japan prefix character with [Japan]', () => {
      // Arrange
      const name = '▅Fw 190 A-5';

      // Act
      const result = cleanVehicleName(name, 'japan');

      // Assert
      expect(result).toBe('[Japan]Fw 190 A-5');
    });

    it('should replace USSR prefix character with [USSR]', () => {
      // Arrange
      const name = '▂Fw 190 D-9';

      // Act
      const result = cleanVehicleName(name, 'ussr');

      // Assert
      expect(result).toBe('[USSR]Fw 190 D-9');
    });

    it('should replace Israel prefix character with [Israel]', () => {
      // Arrange
      const name = 'A-4E Early (M)';

      // Act
      const result = cleanVehicleName(name, 'israel');

      // Assert
      expect(result).toBe('[Israel]A-4E Early (M)');
    });

    it('should use row country for ▄ prefix character', () => {
      // Arrange
      const name = '▄Bf 109 G-2';

      // Act
      const resultSweden = cleanVehicleName(name, 'sweden');
      const resultItaly = cleanVehicleName(name, 'italy');
      const resultJapan = cleanVehicleName(name, 'japan');

      // Assert
      expect(resultSweden).toBe('[Sweden]Bf 109 G-2');
      expect(resultItaly).toBe('[Italy]Bf 109 G-2');
      expect(resultJapan).toBe('[Japan]Bf 109 G-2');
    });

    it('should replace suffix character at end of name', () => {
      // Arrange
      const name = 'F-86F-40 ▅';

      // Act
      const result = cleanVehicleName(name, 'japan');

      // Assert
      expect(result).toBe('F-86F-40 [Japan]');
    });

    it('should return original name if no prefix character found', () => {
      // Arrange
      const name = 'Bf 109 G-2';

      // Act
      const result = cleanVehicleName(name, 'sweden');

      // Assert
      expect(result).toBe('Bf 109 G-2');
    });

    it('should return original name if country is null', () => {
      // Arrange
      const name = '␗A6M2';

      // Act
      const result = cleanVehicleName(name, null);

      // Assert
      expect(result).toBe('␗A6M2');
    });

    it('should handle multiple different country prefixes', () => {
      // Arrange & Act & Assert
      expect(cleanVehicleName('␗A6M2', 'china')).toBe('[China]A6M2');
      expect(cleanVehicleName('▃B-17E', 'usa')).toBe('[USA]B-17E');
      expect(cleanVehicleName('▄Hurricane Mk I/L', 'sweden')).toBe('[Sweden]Hurricane Mk I/L');
      expect(cleanVehicleName('▂B-25J-30', 'ussr')).toBe('[USSR]B-25J-30');
      expect(cleanVehicleName('▅F-86F-40', 'japan')).toBe('[Japan]F-86F-40');
      expect(cleanVehicleName('B-17G', 'israel')).toBe('[Israel]B-17G');
    });
  });
});
