import express from 'express';
import { join } from 'path';
import { config } from './config.js';
import { ensureDataDir } from './utils/fileStorage.js';
import unitsRouter from './routes/units.js';
import laborRatesRouter from './routes/labor-rates.js';
import mileageRatesRouter from './routes/mileage-rates.js';
import projectsRouter from './routes/projects.js';
import settingsRouter from './routes/settings.js';
import departmentsRouter from './routes/departments.js';
import annualProjectsRouter from './routes/annual-projects.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize data directory and files
await ensureDataDir();

const app = express();
app.use(express.json());

// API routes
app.use('/api/units', unitsRouter);
app.use('/api/labor-rates', laborRatesRouter);
app.use('/api/mileage-rates', mileageRatesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/annual-projects', annualProjectsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve static files in production
if (config.isProd) {
  app.use(express.static(config.distDir));
  app.get('*', (req, res) => {
    res.sendFile(join(config.distDir, 'index.html'));
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});