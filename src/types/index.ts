export type UnitType = 'each' | 'foot' | 'hour';
export type LaborRateType = 'hour' | 'day';

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  cost: number;
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