import { Unit, LaborRate, MileageRate, ProjectArea, Department } from '../types';

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

// Mock data for departments
let mockDepartments: Department[] = JSON.parse(localStorage.getItem('departments') || '[]');

export async function fetchDepartments(): Promise<Department[]> {
  try {
    // For development, use mock data
    return Promise.resolve(mockDepartments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

export async function saveDepartment(department: Omit<Department, 'id'>): Promise<Department> {
  try {
    // Generate a random ID for the new department
    const newDepartment: Department = {
      ...department,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockDepartments.push(newDepartment);
    localStorage.setItem('departments', JSON.stringify(mockDepartments));
    return Promise.resolve(newDepartment);
  } catch (error) {
    console.error('Error saving department:', error);
    throw error;
  }
}

export async function updateDepartment(department: Department): Promise<Department> {
  try {
    const index = mockDepartments.findIndex(d => d.id === department.id);
    if (index !== -1) {
      mockDepartments[index] = department;
      localStorage.setItem('departments', JSON.stringify(mockDepartments));
      return Promise.resolve(department);
    }
    throw new Error('Department not found');
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
}

export async function deleteDepartment(id: string): Promise<void> {
  try {
    mockDepartments = mockDepartments.filter(d => d.id !== id);
    localStorage.setItem('departments', JSON.stringify(mockDepartments));
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
}