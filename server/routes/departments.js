import express from 'express';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const dataPath = join(__dirname, '../../data/departments.json');

// Ensure departments.json exists
async function ensureDataFile() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, '[]');
  }
}

// Get all departments with their units
router.get('/', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(dataPath, 'utf8');
    const departments = JSON.parse(data);

    // Get all units
    const unitsPath = join(__dirname, '../../data/units.json');
    const unitsData = await fs.readFile(unitsPath, 'utf8');
    const units = JSON.parse(unitsData);

    // Attach units to their departments
    const departmentsWithUnits = departments.map(dept => ({
      ...dept,
      units: units.filter(unit => unit.departmentId === dept.id)
    }));

    res.json(departmentsWithUnits);
  } catch (error) {
    console.error('Error reading departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Create a new department
router.post('/', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(dataPath, 'utf8');
    const departments = JSON.parse(data);
    
    const newDepartment = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    departments.push(newDepartment);
    await fs.writeFile(dataPath, JSON.stringify(departments, null, 2));
    
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
});

// Update a department
router.put('/:id', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(dataPath, 'utf8');
    let departments = JSON.parse(data);
    
    const index = departments.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    departments[index] = {
      ...req.body,
      id: req.params.id
    };
    
    await fs.writeFile(dataPath, JSON.stringify(departments, null, 2));
    res.json(departments[index]);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: 'Failed to update department' });
  }
});

// Delete a department
router.delete('/:id', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(dataPath, 'utf8');
    let departments = JSON.parse(data);
    
    const index = departments.findIndex(d => d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    departments = departments.filter(d => d.id !== req.params.id);
    await fs.writeFile(dataPath, JSON.stringify(departments, null, 2));
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

export default router;
