import { Db, Collection } from 'mongodb';

let db: Db | null = null;

export async function connectToDatabase(uri: string, dbName: string): Promise<Db> {
  if (db) {
    return db;
  }

  const { MongoClient } = await import('mongodb');
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export function getVehiclesCollection(db: Db): Collection<Record<string, unknown>> {
  return db.collection<Record<string, unknown>>('vehicles');
}

interface VehicleDocument {
  _id: string;
  name: string;
  country: string;
  category: string;
  rank: number | null;
  role: string | null;
  battleRating: {
    arcade: number | null;
    realistic: number | null;
    simulator: number | null;
  };
}

const countryNames: Record<string, string> = {
  usa: 'United States',
  germany: 'Germany',
  ussr: 'Soviet Union',
  britain: 'Britain',
  japan: 'Japan',
  italy: 'Italy',
  france: 'France',
  china: 'China',
  sweden: 'Sweden',
};

const categoryNames: Record<string, string> = {
  aviation: 'Aviation',
  helicopters: 'Helicopters',
  ground: 'Ground Vehicles',
  ships: 'Ships',
  boats: 'Boats',
};

function transformVehicle(v: Record<string, unknown>): VehicleDocument {
  const br = v.battleRating as Record<string, unknown> | undefined;
  return {
    _id: String(v._id),
    name: String(v.name),
    country: String(v.country),
    category: String(v.category),
    rank: v.rank != null ? Number(v.rank) : null,
    role: v.role != null ? String(v.role) : null,
    battleRating: {
      arcade: br?.arcade != null ? Number(br.arcade) : null,
      realistic: br?.realistic != null ? Number(br.realistic) : null,
      simulator: br?.simulator != null ? Number(br.simulator) : null,
    },
  };
}

export const resolvers = {
  Query: {
    vehicles: async (
      _parent: unknown,
      args: { country?: string; category?: string; gameMode?: string; minBr?: number; maxBr?: number }
    ): Promise<VehicleDocument[]> => {
      if (!db) {
        throw new Error('Database not connected');
      }

      const filter: Record<string, unknown> = {};
      if (args.country) {
        filter.country = args.country;
      }
      if (args.category) {
        filter.category = args.category;
      }

      const collection = getVehiclesCollection(db);
      let cursor = collection.find(filter);

      if (args.gameMode && (args.minBr !== undefined || args.maxBr !== undefined)) {
        const brField = `battleRating.${args.gameMode}`;
        const brFilter: Record<string, unknown> = {};
        if (args.minBr !== undefined) {
          brFilter['$gte'] = args.minBr;
        }
        if (args.maxBr !== undefined) {
          brFilter['$lte'] = args.maxBr;
        }
        cursor = collection.find({ ...filter, [brField]: brFilter });
      }

      const vehicles = await cursor.toArray();

      return vehicles.map(transformVehicle);
    },

    vehicle: async (_parent: unknown, args: { id: string }): Promise<VehicleDocument | null> => {
      if (!db) {
        throw new Error('Database not connected');
      }

      const collection = getVehiclesCollection(db);
      const { ObjectId } = await import('mongodb');
      const vehicle = await collection.findOne({ _id: new ObjectId(args.id) });

      if (!vehicle) {
        return null;
      }

      return transformVehicle(vehicle);
    },

    countries: (): { id: string; name: string }[] => {
      return Object.entries(countryNames).map(([id, name]) => ({ id, name }));
    },

    categories: (): { id: string; name: string }[] => {
      return Object.entries(categoryNames).map(([id, name]) => ({ id, name }));
    },
  },

  Vehicle: {
    id: (parent: VehicleDocument): string => parent._id,
  },
};
