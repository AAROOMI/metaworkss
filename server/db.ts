
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Database URL not found. Please ensure the database is provisioned in your Replit.");
  process.exit(1);
}

// Use connection pooling for better performance
export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  max: 10 
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

export const db = drizzle({ client: pool, schema });
