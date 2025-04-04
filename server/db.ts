import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Warning: DATABASE_URL is not set. Database features will be unavailable.");
}

export const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;
export const db = pool ? drizzle({ client: pool, schema }) : null;

// Add connection error handling
if (pool) {
  pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
  });
}
