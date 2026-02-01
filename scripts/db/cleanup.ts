#!/usr/bin/env tsx

/**
 * DATABASE CLEANUP SCRIPT
 * 
 * Safety:
 * - Refuses to run in production (NODE_ENV=production or DB_ENV=prod)
 * - Requires CONFIRM_DB_RESET=true environment variable
 * - Logs DB Host, Name, and Environment before execution
 */

import { MongoClient } from 'mongodb';
import { Client as PgClient } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// --- CONFIGURATION & SAFETY GUARDS ---

const NODE_ENV = process.env.NODE_ENV || 'development';
const DB_ENV = process.env.DB_ENV || 'dev';
const CONFIRM_DB_RESET = process.env.CONFIRM_DB_RESET === 'true';

const IS_PRODUCTION = NODE_ENV === 'production' || DB_ENV === 'prod';

const ROOT_DIR = process.cwd();

interface DBConfig {
  name: string;
  url: string;
  type: 'mongodb' | 'postgres';
}

function discoverDBConfigs(): DBConfig[] {
  const configs: DBConfig[] = [];
  const servicesDir = path.join(ROOT_DIR, 'services');
  const appsDir = path.join(ROOT_DIR, 'apps');

  const scanDir = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      if (!fs.statSync(itemPath).isDirectory()) continue;

      const envPath = path.join(itemPath, '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('#')) continue; // Skip comments

          if (trimmed.startsWith('DATABASE_URL=')) {
            const url = trimmed.split('=')[1];
            if (!url) continue;

            let type: 'mongodb' | 'postgres' = 'mongodb';
            if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
              type = 'postgres';
            }

            configs.push({
              name: `${item} (${type})`,
              url: url,
              type: type
            });
          }
        }
      }
    }
  };

  scanDir(servicesDir);
  scanDir(appsDir);

  // Fallback to root env if needed
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    const type = (url.startsWith('postgresql://') || url.startsWith('postgres://')) ? 'postgres' : 'mongodb';
    if (!configs.find(c => c.url === url)) {
      configs.push({ name: `root (${type})`, url, type: type as any });
    }
  }

  return configs;
}

async function validateSafety() {
  if (IS_PRODUCTION) {
    console.error('❌ ERROR: This script CANNOT be run in a production environment.');
    console.error(`   Current Environment: NODE_ENV=${NODE_ENV}, DB_ENV=${DB_ENV}`);
    process.exit(1);
  }

  if (!CONFIRM_DB_RESET) {
    console.error('❌ ERROR: Action not confirmed.');
    console.error('   Please run with CONFIRM_DB_RESET=true environment variable.');
    console.error('   Example: CONFIRM_DB_RESET=true pnpm db:reset');
    process.exit(1);
  }
}

// --- DATABASE DRIVERS ---

async function cleanMongoDB(config: DBConfig) {
  const client = new MongoClient(config.url);
  try {
    await client.connect();
    const db = client.db();
    const dbName = db.databaseName;
    const host = client.options.hosts[0];

    console.log(`⚠️  Resetting database: ${dbName} on ${host}`);
    
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      if (col.name.startsWith('system.')) continue;
      
      // Preserve migration history if it exists
      if (col.name.includes('migration') || col.name.includes('changelog')) {
        console.log(`ℹ️  Skipping migration collection: ${col.name}`);
        continue;
      }

      await db.collection(col.name).deleteMany({});
      console.log(`Notice: 🧹 Cleared collection: ${col.name}`);
    }
  } finally {
    await client.close();
  }
}

async function cleanPostgres(config: DBConfig) {
  const client = new PgClient({ connectionString: config.url });
  try {
    await client.connect();
    // @ts-ignore
    const dbName = client.database || 'unknown';
    // @ts-ignore
    const host = client.host || 'unknown';

    console.log(`⚠️  Resetting database: ${dbName} on ${host}`);

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT ILIKE '%migration%'
      AND table_name NOT ILIKE '%changelog%'
    `);

    const tables = res.rows.map(row => row.table_name);

    if (tables.length > 0) {
      const truncateQuery = `TRUNCATE TABLE ${tables.map(t => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE;`;
      await client.query(truncateQuery);
      
      for (const table of tables) {
        console.log(`Notice: 🧹 Cleared table: ${table}`);
      }
    } else {
      console.log('ℹ️  No tables found to clear.');
    }
  } finally {
    await client.end();
  }
}

// --- MAIN EXECUTION ---

async function main() {
  await validateSafety();

  const configs = discoverDBConfigs();

  console.log('\n🚀 Starting Database Cleanup...');
  console.log(`Environment: ${NODE_ENV}\n`);

  if (configs.length === 0) {
    console.warn('⚠️  No active database configurations found in any service or app .env files.');
    return;
  }

  // Deduplicate by URL to avoid double work
  const uniqueConfigs = Array.from(new Map(configs.map(c => [c.url, c])).values());

  for (const config of uniqueConfigs) {
    console.log(`\n--- Cleaning [${config.name}] ---`);
    try {
      if (config.type === 'mongodb') {
        await cleanMongoDB(config);
      } else if (config.type === 'postgres') {
        await cleanPostgres(config);
      }
    } catch (error: any) {
      console.error(`❌ Failed to clean ${config.name}: ${error.message}`);
      // Continue to next DB instead of exiting immediately?
      // For safety, let's keep exit on failure but log clearly.
      process.exit(1);
    }
  }

  console.log('\n✅ Database reset complete — fresh state achieved\n');
}

main().catch(err => {
  console.error('❌ UNEXPECTED FATAL ERROR:');
  console.error(err);
  process.exit(1);
});
