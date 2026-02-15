import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';
import {
  SELECTORS,
  getVehicleRows,
  extractName,
  extractRole,
  extractRank,
  extractBR,
  extractCountry,
  parseHtmlTable,
} from '../src/scraper/parser.js';

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
});
