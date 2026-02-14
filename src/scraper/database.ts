import { MongoClient, Db, Collection } from 'mongodb';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { logInfo, logDebug, logError, logWarning } from '../utils/logger.js';

export interface VehicleDocument {
  _id: string;
  country: string;
  category: string;
  name: string;
  rank: number | null;
  battleRating: {
    arcade: number | null;
    realistic: number | null;
    simulator: number | null;
  };
  role: string | null;
  source: {
    file: string;
  };
  lastUpdatedAt: Date;
}

interface JsonVehicle {
  name: string;
  rank: number | null;
  battleRating: {
    arcade: number | null;
    realistic: number | null;
    simulator: number | null;
  };
  role: string | null;
}

interface JsonData {
  country: string;
  category: string;
  vehicles: JsonVehicle[];
}

let client: MongoClient | null = null;
let db: Db | null = null;

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function tryStartMongoDB(): Promise<boolean> {
  logInfo('Checking if MongoDB can be auto-started...');
  
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      logInfo('MongoDB auto-start check timed out.');
      resolve(false);
    }, 3000);

    exec('which mongod', (err) => {
      if (err) {
        clearTimeout(timeout);

        logInfo('MongoDB not installed.');

        resolve(false);

        return;
      }

      exec('pgrep -x mongod', (pgrepErr) => {
        if (!pgrepErr) {
          clearTimeout(timeout);

          resolve(true);

          return;
        }

        clearTimeout(timeout);

        logInfo('MongoDB not running. Manual start required: sudo systemctl start mongod');

        resolve(false);
      });
    });
  });
}

export async function connectToDatabase(): Promise<Db | null> {
  if (db) {
    return db;
  }

  const uri = getEnvVar('MONGO_URI');
  const dbName = getEnvVar('MONGO_DB');

  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      logInfo(`Connecting to MongoDB (attempt ${i + 1}/${maxRetries})...`);

      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });

      await client.connect();

      db = client.db(dbName);

      logInfo(`Connected to MongoDB: ${dbName}`);

      return db;
    } catch (error) {
      logError(
        'db-population',
        'connection',
        'database',
        uri,
        `Connection failed (attempt ${i + 1}/${maxRetries}): ${error}`
      );
      
      if (i === 0) {
        await tryStartMongoDB();
      }
      
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  logInfo('MongoDB unavailable. Skipping database population.');
  logInfo('To enable DB population, start MongoDB: sudo systemctl start mongod');

  return null;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();

    client = null;
    db = null;

    logDebug('Closed MongoDB connection');
  }
}

function generateId(country: string, category: string, name: string): string {
  return `${country}-${category}-${name}`;
}

export async function populateDatabase(): Promise<void> {
  const db = await connectToDatabase();
  
  if (!db) {
    return;
  }
  
  const collection: Collection<VehicleDocument> = db.collection('vehicles');

  const dataDir = path.join(process.cwd(), 'data');
  const categories = ['aviation'];

  const failedDocuments: { id: string; error: string }[] = [];
  let totalProcessed = 0;
  let totalSuccessful = 0;

  for (const category of categories) {
    const categoryDir = path.join(dataDir, category);

    try {
      const files = await fs.readdir(categoryDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      for (const file of jsonFiles) {
        const country = file.replace('.json', '');
        const filepath = path.join(categoryDir, file);

        logInfo(`Processing ${country}/${category}...`);

        const content = await fs.readFile(filepath, 'utf-8');
        const data: JsonData = JSON.parse(content);

        for (const vehicle of data.vehicles) {
          totalProcessed++;

          const doc: VehicleDocument = {
            _id: generateId(data.country, data.category, vehicle.name),
            country: data.country,
            category: data.category,
            name: vehicle.name,
            rank: vehicle.rank,
            battleRating: vehicle.battleRating,
            role: vehicle.role,
            source: {
              file: `data/${category}/${file}`,
            },
            lastUpdatedAt: new Date(),
          };

          const maxRetries = 2;
          let success = false;
          let lastError: Error | null = null;

          for (let i = 0; i < maxRetries; i++) {
            try {
              await collection.updateOne(
                { _id: doc._id },
                { $set: doc },
                { upsert: true }
              );

              success = true;

              break;
            } catch (error) {
              lastError = error as Error;
            }
          }

          if (success) {
            totalSuccessful++;
          } else {
            failedDocuments.push({
              id: `${data.country}/${data.category}/${vehicle.name}`,
              error: lastError?.message || 'Unknown error',
            });

            logWarning(
              'db-population',
              data.country,
              data.category,
              vehicle.name,
              `Upsert failed: ${lastError?.message}`
            );
          }
        }
      }
    } catch (error) {
      logError(
        'db-population',
        'read',
        category,
        categoryDir,
        `Failed to read data directory: ${error}`
      );
    }
  }

  logInfo(`=== DB Population Summary ===`);
  logInfo(`Total documents processed: ${totalProcessed}`);
  logInfo(`Successful: ${totalSuccessful}`);
  logInfo(`Failed: ${failedDocuments.length}`);

  if (failedDocuments.length > 0) {
    logInfo(`\nFailed documents:`);

    for (const doc of failedDocuments) {
      logInfo(`  - ${doc.id}: ${doc.error}`);
    }
  }

  await closeDatabase();
}

export async function initDatabase(): Promise<void> {
  try {
    await connectToDatabase();

    logInfo('Database initialized successfully');

    await closeDatabase();
  } catch (error) {
    logError(
      'db-population',
      'init',
      'database',
      process.env.MONGO_URI || 'unknown',
      `Database initialization failed: ${error}`
    );
    
    throw error;
  }
}
