import { create } from 'zustand';
import { Unit, ProjectArea, LaborRate, MileageRate, Department } from '../types';
import * as api from '../services/api';

interface Store {
  units: Unit[];
  departments: Department[];
  laborRates: LaborRate[];
  mileageRates: MileageRate[];
  projects: ProjectArea[];
  selectedProject: ProjectArea | null;
  fetchUnits: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
  fetchLaborRates: () => Promise<void>;
  fetchMileageRates: () => Promise<void>;
  addUnit: (unit: Omit<Unit, 'id'>) => Promise<void>;
  addDepartment: (department: Omit<Department, 'id' | 'units'>) => Promise<void>;
  updateUnit: (unit: Unit) => Promise<void>;
  updateDepartment: (department: Department) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<ProjectArea, 'id'>) => Promise<void>;
  updateProject: (project: ProjectArea) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSelectedProject: (project: ProjectArea | null) => void;
}

export const useStore = create<Store>((set, get) => ({
  units: [],
  departments: [],
  laborRates: [],
  mileageRates: [],
  projects: [],
  selectedProject: null,

  fetchUnits: async () => {
    try {
      const units = await api.fetchUnits();
      set({ units });
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  },

  fetchDepartments: async () => {
    try {
      const departments = await api.fetchDepartments();
      set({ departments });
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  },

  fetchLaborRates: async () => {
    try {
      const laborRates = await api.fetchLaborRates();
      set({ laborRates });
    } catch (error) {
      console.error('Error fetching labor rates:', error);
    }
  },

  fetchMileageRates: async () => {
    try {
      const mileageRates = await api.fetchMileageRates();
      set({ mileageRates });
    } catch (error) {
      console.error('Error fetching mileage rates:', error);
    }
  },

  addUnit: async (unit) => {
    try {
      const newUnit = await api.saveUnit(unit);
      set((state) => ({
        units: [...state.units, newUnit],
        departments: state.departments.map(dept => 
          dept.id === newUnit.departmentId 
            ? { ...dept, units: [...(dept.units || []), newUnit] }
            : dept
        )
      }));
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  },

  addDepartment: async (department) => {
    try {
      const newDepartment = await api.saveDepartment({ ...department, units: [] });
      set((state) => ({
        departments: [...state.departments, { ...newDepartment, units: [] }]
      }));
    } catch (error) {
      console.error('Error adding department:', error);
    }
  },

  updateUnit: async (unit) => {
    try {
      const updatedUnit = await api.updateUnit(unit);
      set((state) => ({
        units: state.units.map((u) => (u.id === updatedUnit.id ? updatedUnit : u)),
        departments: state.departments.map(dept => 
          dept.id === updatedUnit.departmentId 
            ? { 
                ...dept, 
                units: dept.units.map(u => u.id === updatedUnit.id ? updatedUnit : u)
              }
            : dept
        )
      }));
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  },

  updateDepartment: async (department) => {
    try {
      const updatedDepartment = await api.updateDepartment(department);
      set((state) => ({
        departments: state.departments.map((d) => 
          d.id === updatedDepartment.id ? updatedDepartment : d
        )
      }));
    } catch (error) {
      console.error('Error updating department:', error);
    }
  },

  deleteUnit: async (id) => {
    try {
      await api.deleteUnit(id);
      set((state) => ({
        units: state.units.filter((u) => u.id !== id),
        departments: state.departments.map(dept => ({
          ...dept,
          units: dept.units.filter(u => u.id !== id)
        }))
      }));
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  },

  deleteDepartment: async (id) => {
    try {
      await api.deleteDepartment(id);
      set((state) => ({
        departments: state.departments.filter((d) => d.id !== id),
        units: state.units.filter((u) => u.departmentId !== id)
      }));
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  },

  addLaborRate: async (rate) => {
    try {
      const savedRate = await api.saveLaborRate(rate);
      set((state) => ({ laborRates: [...state.laborRates, savedRate] }));
    } catch (error) {
      console.error('Error adding labor rate:', error);
    }
  },

  updateLaborRate: async (rate) => {
    try {
      const updatedRate = await api.updateLaborRate(rate);
      set((state) => ({
        laborRates: state.laborRates.map((r) => (r.id === updatedRate.id ? updatedRate : r)),
      }));
    } catch (error) {
      console.error('Error updating labor rate:', error);
    }
  },

  deleteLaborRate: async (id) => {
    try {
      await api.deleteLaborRate(id);
      set((state) => ({ laborRates: state.laborRates.filter((r) => r.id !== id) }));
    } catch (error) {
      console.error('Error deleting labor rate:', error);
    }
  },

  addMileageRate: async (rate) => {
    try {
      const savedRate = await api.saveMileageRate(rate);
      set((state) => ({ mileageRates: [...state.mileageRates, savedRate] }));
    } catch (error) {
      console.error('Error adding mileage rate:', error);
    }
  },

  updateMileageRate: async (rate) => {
    try {
      const updatedRate = await api.updateMileageRate(rate);
      set((state) => ({
        mileageRates: state.mileageRates.map((r) => (r.id === updatedRate.id ? updatedRate : r)),
      }));
    } catch (error) {
      console.error('Error updating mileage rate:', error);
    }
  },

  deleteMileageRate: async (id) => {
    try {
      await api.deleteMileageRate(id);
      set((state) => ({ mileageRates: state.mileageRates.filter((r) => r.id !== id) }));
    } catch (error) {
      console.error('Error deleting mileage rate:', error);
    }
  },

  fetchProjects: async () => {
    try {
      const projects = await api.fetchProjects();
      set({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  },

  addProject: async (project) => {
    try {
      const savedProject = await api.saveProject(project);
      set((state) => ({ projects: [...state.projects, savedProject] }));
    } catch (error) {
      console.error('Error adding project:', error);
    }
  },

  updateProject: async (project) => {
    try {
      const updatedProject = await api.updateProject(project);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
      }));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  },

  deleteProject: async (id) => {
    try {
      await api.deleteProject(id);
      set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  },

  setSelectedProject: (project) => {
    set({ selectedProject: project });
  },
}));