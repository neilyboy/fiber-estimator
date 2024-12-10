import { Unit, LaborRate, MileageRate, ProjectArea } from '../types';

const API_BASE = '/api';

export async function fetchUnits(): Promise<Unit[]> {
  const response = await fetch(`${API_BASE}/units`);
  if (!response.ok) throw new Error('Failed to fetch units');
  return response.json();
}

export async function saveUnit(unit: any): Promise<Unit> {
  const response = await fetch(`${API_BASE}/units`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unit),
  });
  if (!response.ok) throw new Error('Failed to save unit');
  return response.json();
}

export async function updateUnit(unit: any): Promise<Unit> {
  const response = await fetch(`${API_BASE}/units/${unit.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unit),
  });
  if (!response.ok) throw new Error('Failed to update unit');
  return response.json();
}

export async function fetchLaborRates(): Promise<LaborRate[]> {
  const response = await fetch(`${API_BASE}/labor-rates`);
  if (!response.ok) throw new Error('Failed to fetch labor rates');
  return response.json();
}

export async function saveLaborRate(rate: any): Promise<LaborRate> {
  const response = await fetch(`${API_BASE}/labor-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rate),
  });
  if (!response.ok) throw new Error('Failed to save labor rate');
  return response.json();
}

export async function updateLaborRate(rate: any): Promise<LaborRate> {
  const response = await fetch(`${API_BASE}/labor-rates/${rate.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rate),
  });
  if (!response.ok) throw new Error('Failed to update labor rate');
  return response.json();
}

export async function fetchMileageRates(): Promise<MileageRate[]> {
  const response = await fetch(`${API_BASE}/mileage-rates`);
  if (!response.ok) throw new Error('Failed to fetch mileage rates');
  return response.json();
}

export async function saveMileageRate(rate: any): Promise<MileageRate> {
  const response = await fetch(`${API_BASE}/mileage-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rate),
  });
  if (!response.ok) throw new Error('Failed to save mileage rate');
  return response.json();
}

export async function updateMileageRate(rate: any): Promise<MileageRate> {
  const response = await fetch(`${API_BASE}/mileage-rates/${rate.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rate),
  });
  if (!response.ok) throw new Error('Failed to update mileage rate');
  return response.json();
}

export interface Project {
  id: string;
  name: string;
  imageUrl?: string;
  homesPassed: number;
  currentCustomers: number;
  notes: string;
  monthlyIncomePerCustomer: number;
  projectedGrowthPercentage: number;
  units: {
    unitId: string;
    quantity: number;
  }[];
  laborRates: {
    laborRateId: string;
    quantity: number;
  }[];
  mileageRates: {
    mileageRateId: string;
    trips: number;
  }[];
}

export async function fetchProjects(): Promise<ProjectArea[]> {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export async function saveProject(project: ProjectArea): Promise<ProjectArea> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to save project');
    }
    return response.json();
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

export async function updateProject(project: ProjectArea): Promise<ProjectArea> {
  try {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};