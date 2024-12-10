import { Unit, LaborRate, MileageRate, ProjectArea, Department, AnnualProject } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchUnits(): Promise<Unit[]> {
  const response = await fetch(`${API_BASE}/units`);
  if (!response.ok) throw new Error('Failed to fetch units');
  return response.json();
}

export async function saveUnit(unit: Omit<Unit, 'id'>): Promise<Unit> {
  try {
    const response = await fetch(`${API_BASE}/units`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unit),
    });
    if (!response.ok) {
      throw new Error('Failed to save unit');
    }
    return response.json();
  } catch (error) {
    console.error('Error saving unit:', error);
    throw error;
  }
}

export async function updateUnit(unit: Unit): Promise<Unit> {
  try {
    const response = await fetch(`${API_BASE}/units/${unit.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unit),
    });
    if (!response.ok) {
      throw new Error('Failed to update unit');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
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
    const response = await fetch(`${API_BASE}/projects`);
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
    const response = await fetch(`${API_BASE}/projects`, {
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
    const response = await fetch(`${API_BASE}/projects/${project.id}`, {
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

export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

export async function fetchDepartments(): Promise<Department[]> {
  const response = await fetch(`${API_BASE}/departments`);
  if (!response.ok) throw new Error('Failed to fetch departments');
  return response.json();
}

export async function saveDepartment(department: Omit<Department, 'id'>): Promise<Department> {
  const response = await fetch(`${API_BASE}/departments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(department),
  });
  if (!response.ok) throw new Error('Failed to save department');
  return response.json();
}

export async function updateDepartment(department: Department): Promise<Department> {
  const response = await fetch(`${API_BASE}/departments/${department.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(department),
  });
  if (!response.ok) throw new Error('Failed to update department');
  return response.json();
}

export async function deleteDepartment(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/departments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete department');
}

export async function fetchAnnualProjects(): Promise<AnnualProject[]> {
  const response = await fetch(`${API_BASE}/annual-projects`);
  if (!response.ok) throw new Error('Failed to fetch annual projects');
  return response.json();
}

export async function saveAnnualProject(project: Omit<AnnualProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnnualProject> {
  try {
    const response = await fetch(`${API_BASE}/annual-projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to save annual project');
    }
    return response.json();
  } catch (error) {
    console.error('Error saving annual project:', error);
    throw error;
  }
}

export async function updateAnnualProject(project: Omit<AnnualProject, 'createdAt' | 'updatedAt'>): Promise<AnnualProject> {
  try {
    const response = await fetch(`${API_BASE}/annual-projects/${project.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error('Failed to update annual project');
    }
    return response.json();
  } catch (error) {
    console.error('Error updating annual project:', error);
    throw error;
  }
}

export async function deleteAnnualProject(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/annual-projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete annual project');
    }
  } catch (error) {
    console.error('Error deleting annual project:', error);
    throw error;
  }
}