import express from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const settings = await readJsonFile('settings.json');
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

router.post('/', async (req, res) => {
  try {
    await writeJsonFile('settings.json', req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;