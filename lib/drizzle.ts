// lib/drizzle.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!); // use Supabase's `DB_URL` here
export const db = drizzle(client);
