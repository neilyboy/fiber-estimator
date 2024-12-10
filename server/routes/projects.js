import express from 'express';
import { readJsonFile, writeJsonFile } from '../utils/fileStorage.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await readJsonFile('projects.json');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

router.post('/', async (req, res) => {
  try {
    const projects = await readJsonFile('projects.json');
    const newProject = { ...req.body, id: crypto.randomUUID() };
    projects.push(newProject);
    await writeJsonFile('projects.json', projects);
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const projects = await readJsonFile('projects.json');
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    projects[index] = { ...req.body, id: req.params.id };
    await writeJsonFile('projects.json', projects);
    res.json(projects[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

export default router;