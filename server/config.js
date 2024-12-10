import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
  port: process.env.PORT || 3000,
  dataDir: join(__dirname, '../data'),
  isProd: process.env.NODE_ENV === 'production',
  distDir: join(__dirname, '../dist')
};