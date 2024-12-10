import fs from 'fs/promises';
import { join } from 'path';
import { config } from '../config.js';

const defaultData = {
  'units.json': [],
  'labor-rates.json': [],
  'mileage-rates.json': [],
  'projects.json': [],
  'settings.json': { 
    monthlyIncomePerCustomer: 0,
    projectedGrowthPercentage: 0
  }
};

export async function ensureDataDir() {
  try {
    await fs.access(config.dataDir);
  } catch {
    await fs.mkdir(config.dataDir, { recursive: true });
  }

  // Initialize all JSON files if they don't exist
  for (const [filename, initialData] of Object.entries(defaultData)) {
    const filePath = join(config.dataDir, filename);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
    }
  }
}

export async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(join(config.dataDir, filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const defaultContent = defaultData[filename] || [];
      await writeJsonFile(filename, defaultContent);
      return defaultContent;
    }
    throw error;
  }
}

export async function writeJsonFile(filename, data) {
  const filePath = join(config.dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}