import { create } from 'zustand';
import { Unit, ProjectArea, LaborRate, MileageRate, Settings } from '../types';
import * as api from '../services/api';

interface Store {
  units: Unit[];
  laborRates: LaborRate[];
  mileageRates: MileageRate[];
  projects: ProjectArea[];
  monthlyIncomePerCustomer: number;
  projectedGrowthPercentage: number;
  initialized: boolean;
  addUnit: (unit: Unit) => Promise<void>;
  updateUnit: (unit: Unit) => Promise<void>;
  addLaborRate: (rate: LaborRate) => Promise<void>;
  updateLaborRate: (rate: LaborRate) => Promise<void>;
  addMileageRate: (rate: MileageRate) => Promise<void>;
  updateMileageRate: (rate: MileageRate) => Promise<void>;
  addProject: (project: ProjectArea) => Promise<void>;
  updateProject: (project: ProjectArea) => Promise<void>;
  setMonthlyIncomePerCustomer: (amount: number) => Promise<void>;
  setProjectedGrowthPercentage: (percentage: number) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  units: [],
  laborRates: [],
  mileageRates: [],
  projects: [],
  monthlyIncomePerCustomer: 0,
  projectedGrowthPercentage: 0,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;

    try {
      const [units, laborRates, mileageRates, projects, settings] = await Promise.all([
        api.fetchUnits(),
        api.fetchLaborRates(),
        api.fetchMileageRates(),
        api.fetchProjects(),
        api.fetchSettings(),
      ]);

      set({
        units,
        laborRates,
        mileageRates,
        projects,
        monthlyIncomePerCustomer: settings.monthlyIncomePerCustomer,
        projectedGrowthPercentage: settings.projectedGrowthPercentage || 0,
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize store:', error);
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

  setMonthlyIncomePerCustomer: async (amount) => {
    try {
      const currentSettings = await api.fetchSettings();
      const newSettings = { ...currentSettings, monthlyIncomePerCustomer: amount };
      await api.saveSettings(newSettings);
      set({ monthlyIncomePerCustomer: amount });
    } catch (error) {
      console.error('Failed to save monthly income:', error);
      throw error;
    }
  },

  setProjectedGrowthPercentage: async (percentage) => {
    try {
      const currentSettings = await api.fetchSettings();
      const newSettings = { ...currentSettings, projectedGrowthPercentage: percentage };
      await api.saveSettings(newSettings);
      set({ projectedGrowthPercentage: percentage });
    } catch (error) {
      console.error('Failed to save projected growth percentage:', error);
      throw error;
    }
  },
}));