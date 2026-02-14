import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from './resolvers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'warthunder';

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

async function startServer() {
  const { resolvers } = await import('./resolvers/index.js');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server as never, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }) as never
  );

  app.get('/health', (_req: unknown, res: { json: (data: { status: string }) => void }) => {
    res.json({ status: 'ok' });
  });

  try {
    await connectToDatabase(MONGO_URI, MONGO_DB);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
