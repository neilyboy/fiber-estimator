import express from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const units = await readJsonFile('units.json');
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read units' });
  }
});

router.post('/', async (req, res) => {
  try {
    const units = await readJsonFile('units.json');
    const newUnit = { ...req.body, id: crypto.randomUUID() };
    units.push(newUnit);
    await writeJsonFile('units.json', units);
    res.json(newUnit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save unit' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const units = await readJsonFile('units.json');
    const index = units.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Unit not found' });
      return;
    }
    units[index] = { ...req.body, id: req.params.id };
    await writeJsonFile('units.json', units);
    res.json(units[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

export default router;