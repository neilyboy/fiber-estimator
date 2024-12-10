import express from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rates = await readJsonFile('labor-rates.json');
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read labor rates' });
  }
});

router.post('/', async (req, res) => {
  try {
    const rates = await readJsonFile('labor-rates.json');
    const newRate = { ...req.body, id: crypto.randomUUID() };
    rates.push(newRate);
    await writeJsonFile('labor-rates.json', rates);
    res.json(newRate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save labor rate' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const rates = await readJsonFile('labor-rates.json');
    const index = rates.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Labor rate not found' });
      return;
    }
    rates[index] = { ...req.body, id: req.params.id };
    await writeJsonFile('labor-rates.json', rates);
    res.json(rates[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update labor rate' });
  }
});

export default router;