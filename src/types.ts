export interface Unit {
  id: string;
  name: string;
  cost: number;
  type: string;
}

export interface LaborRate {
  id: string;
  name: string;
  cost: number;
  type: string;
}

export interface MileageRate {
  id: string;
  name: string;
  distance: number;
  costPerMile: number;
}

export interface ProjectArea {
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
