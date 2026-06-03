import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const envPath = path.join(serverRoot, '.env');

if (existsSync(envPath)) {
  config({ path: envPath });
}
