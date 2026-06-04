import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const envPath = path.join(serverRoot, '.env');

// Railway injects env vars — never load local .env in production (would override PORT, etc.).
if (!process.env.RAILWAY_ENVIRONMENT && existsSync(envPath)) {
  config({ path: envPath });
}
