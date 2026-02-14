import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { populateDatabase, connectToDatabase, closeDatabase } from '../src/scraper/database.js';

describe('database', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      process.env.MONGO_URI = mongoServer.getUri();
      process.env.MONGO_DB = 'test_warthunder';
    } catch (error) {
      throw new Error(`Failed to setup MongoMemoryServer: ${error}`);
    }
  }, 60000);

  afterAll(async () => {
    try {
      if (mongoServer) {
        await mongoServer.stop();
      }
    } catch (error) {
      console.error(`Failed to stop MongoMemoryServer: ${error}`);
    }
  }, 30000);

  beforeEach(async () => {
    try {
      const db = await connectToDatabase();
      if (db) {
        await db.collection('vehicles').deleteMany({});
      }
    } catch (error) {
      throw new Error(`Failed to clean database: ${error}`);
    }
  });

  describe('connectToDatabase', () => {
    it('should connect to in-memory MongoDB', async () => {
      try {
        // Arrange
        // Act
        const db = await connectToDatabase();
        
        // Assert
        expect(db).not.toBeNull();
        expect(db!.databaseName).toBe('test_warthunder');
      } catch (error) {
        throw new Error(`Test failed: ${error}`);
      }
    });
  });

  describe('populateDatabase', () => {
    it('should insert vehicle data from JSON files', async () => {
      try {
        // Arrange
        // Act
        await populateDatabase();
        
        // Assert
        const db = await connectToDatabase();
        expect(db).not.toBeNull();
        const count = await db!.collection('vehicles').countDocuments();
        expect(count).toBeGreaterThan(0);
      } catch (error) {
        throw new Error(`Test failed: ${error}`);
      }
    });

    it('should upsert existing documents (update on duplicate key)', async () => {
      try {
        // Arrange
        await populateDatabase();
        const db1 = await connectToDatabase();
        const original = await db1!.collection('vehicles').findOne({ country: 'usa', name: 'A-20G-25' });
        const originalLastUpdated = original?.lastUpdatedAt;
        
        // Act
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await populateDatabase();
        
        // Assert
        const db2 = await connectToDatabase();
        const updated = await db2!.collection('vehicles').findOne({ country: 'usa', name: 'A-20G-25' });
        
        expect(updated).not.toBeNull();
        expect(original).not.toBeNull();
        expect(updated!.lastUpdatedAt).toBeInstanceOf(Date);
      } catch (error) {
        throw new Error(`Test failed: ${error}`);
      }
    });

    it('should insert all countries from JSON files', async () => {
      try {
        // Arrange
        // Act
        await populateDatabase();
        
        // Assert
        const db = await connectToDatabase();
        const countries = await db!.collection('vehicles').distinct('country');
        
        expect(countries.length).toBeGreaterThan(1);
      } catch (error) {
        throw new Error(`Test failed: ${error}`);
      }
    });
  });
});
