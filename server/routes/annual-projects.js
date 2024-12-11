import express from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const annualProjects = await readJsonFile('annual-projects.json');
    res.json(annualProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read annual projects' });
  }
});

router.post('/', async (req, res) => {
  try {
    const annualProjects = await readJsonFile('annual-projects.json');
    const now = new Date().toISOString();
    const newProject = {
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    annualProjects.push(newProject);
    await writeJsonFile('annual-projects.json', annualProjects);
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save annual project' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const annualProjects = await readJsonFile('annual-projects.json');
    const index = annualProjects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Annual project not found' });
      return;
    }
    const now = new Date().toISOString();
    annualProjects[index] = {
      ...req.body,
      id: req.params.id,
      createdAt: annualProjects[index].createdAt,
      updatedAt: now
    };
    await writeJsonFile('annual-projects.json', annualProjects);
    res.json(annualProjects[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update annual project' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const annualProjects = await readJsonFile('annual-projects.json');
    const index = annualProjects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Annual project not found' });
      return;
    }
    annualProjects.splice(index, 1);
    await writeJsonFile('annual-projects.json', annualProjects);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete annual project' });
  }
});

export default router;
