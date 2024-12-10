import { create } from 'zustand';
import { Unit, ProjectArea, LaborRate, MileageRate } from '../types';
import * as api from '../services/api';

interface Store {
  units: Unit[];
  laborRates: LaborRate[];
  mileageRates: MileageRate[];
  projects: ProjectArea[];
  fetchUnits: () => Promise<void>;
  fetchLaborRates: () => Promise<void>;
  fetchMileageRates: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  addUnit: (unit: Unit) => Promise<void>;
  updateUnit: (unit: Unit) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  addLaborRate: (rate: LaborRate) => Promise<void>;
  updateLaborRate: (rate: LaborRate) => Promise<void>;
  deleteLaborRate: (id: string) => Promise<void>;
  addMileageRate: (rate: MileageRate) => Promise<void>;
  updateMileageRate: (rate: MileageRate) => Promise<void>;
  deleteMileageRate: (id: string) => Promise<void>;
  addProject: (project: ProjectArea) => Promise<void>;
  updateProject: (project: ProjectArea) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  units: [],
  laborRates: [],
  mileageRates: [],
  projects: [],

  fetchUnits: async () => {
    try {
      const units = await api.fetchUnits();
      set({ units });
    } catch (error) {
      console.error('Failed to fetch units:', error);
      throw error;
    }
  },

  fetchLaborRates: async () => {
    try {
      const laborRates = await api.fetchLaborRates();
      set({ laborRates });
    } catch (error) {
      console.error('Failed to fetch labor rates:', error);
      throw error;
    }
  },

  fetchMileageRates: async () => {
    try {
      const mileageRates = await api.fetchMileageRates();
      set({ mileageRates });
    } catch (error) {
      console.error('Failed to fetch mileage rates:', error);
      throw error;
    }
  },

  fetchProjects: async () => {
    try {
      const projects = await api.fetchProjects();
      set({ projects });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  },

  addUnit: async (unit) => {
    try {
      const savedUnit = await api.saveUnit(unit);
      set((state) => ({ units: [...state.units, savedUnit] }));
    } catch (error) {
      console.error('Failed to add unit:', error);
      throw error;
    }
  },

  updateUnit: async (unit) => {
    try {
      const updatedUnit = await api.updateUnit(unit);
      set((state) => ({
        units: state.units.map((u) => (u.id === unit.id ? updatedUnit : u)),
      }));
    } catch (error) {
      console.error('Failed to update unit:', error);
      throw error;
    }
  },

  deleteUnit: async (id) => {
    try {
      await api.deleteUnit(id);
      set((state) => ({ units: state.units.filter((u) => u.id !== id) }));
    } catch (error) {
      console.error('Failed to delete unit:', error);
      throw error;
    }
  },

  addLaborRate: async (rate) => {
    try {
      const savedRate = await api.saveLaborRate(rate);
      set((state) => ({ laborRates: [...state.laborRates, savedRate] }));
    } catch (error) {
      console.error('Failed to add labor rate:', error);
      throw error;
    }
  },

  updateLaborRate: async (rate) => {
    try {
      const updatedRate = await api.updateLaborRate(rate);
      set((state) => ({
        laborRates: state.laborRates.map((r) => (r.id === rate.id ? updatedRate : r)),
      }));
    } catch (error) {
      console.error('Failed to update labor rate:', error);
      throw error;
    }
  },

  deleteLaborRate: async (id) => {
    try {
      await api.deleteLaborRate(id);
      set((state) => ({ laborRates: state.laborRates.filter((r) => r.id !== id) }));
    } catch (error) {
      console.error('Failed to delete labor rate:', error);
      throw error;
    }
  },

  addMileageRate: async (rate) => {
    try {
      const savedRate = await api.saveMileageRate(rate);
      set((state) => ({ mileageRates: [...state.mileageRates, savedRate] }));
    } catch (error) {
      console.error('Failed to add mileage rate:', error);
      throw error;
    }
  },

  updateMileageRate: async (rate) => {
    try {
      const updatedRate = await api.updateMileageRate(rate);
      set((state) => ({
        mileageRates: state.mileageRates.map((r) => (r.id === rate.id ? updatedRate : r)),
      }));
    } catch (error) {
      console.error('Failed to update mileage rate:', error);
      throw error;
    }
  },

  deleteMileageRate: async (id) => {
    try {
      await api.deleteMileageRate(id);
      set((state) => ({ mileageRates: state.mileageRates.filter((r) => r.id !== id) }));
    } catch (error) {
      console.error('Failed to delete mileage rate:', error);
      throw error;
    }
  },

  addProject: async (project) => {
    try {
      const savedProject = await api.saveProject(project);
      set((state) => ({ projects: [...state.projects, savedProject] }));
    } catch (error) {
      console.error('Failed to add project:', error);
      throw error;
    }
  },

  updateProject: async (project) => {
    try {
      const updatedProject = await api.updateProject(project);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === project.id ? updatedProject : p)),
      }));
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      await api.deleteProject(id);
      set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  },
}));