export type UnitType = 'each' | 'foot' | 'hour';
export type LaborRateType = 'hour' | 'day';

export interface Department {
  id: string;
  name: string;
  description?: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  departmentId: string;
  name: string;
  description?: string;
  type: string;
  cost: number;
  quantity: number;
}

export interface LaborRate {
  id: string;
  name: string;
  type: LaborRateType;
  cost: number;
}

export interface MileageRate {
  id: string;
  distance: number;
  costPerMile: number;
}

export interface ProjectArea {
  id: string;
  name: string;
  imageUrl: string;
  notes: string;
  homesPassed: number;
  currentCustomers: number;
  monthlyIncomePerCustomer: number;
  projectedGrowthPercentage: number;
  units: ProjectUnit[];
  laborRates: ProjectLaborRate[];
  mileageRates: ProjectMileageRate[];
}

export interface ProjectUnit {
  unitId: string;
  quantity: number;
}

export interface ProjectLaborRate {
  laborRateId: string;
  quantity: number;
}

export interface ProjectMileageRate {
  mileageRateId: string;
  trips: number;
}

export interface Settings {
  monthlyIncomePerCustomer: number;
  projectedGrowthPercentage: number;
}

export interface AnnualProject {
  id: string;
  name: string;
  notes?: string;
  projectIds: string[];  // Array of regular project IDs included in this annual project
  createdAt: string;
  updatedAt: string;
}