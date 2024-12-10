import { Unit, ProjectArea, LaborRate, MileageRate } from '../types';

interface ROICalculation {
  currentTakeRate: number;
  projectedNewCustomers: number;
  totalProjectedCustomers: number;
  projectedTakeRate: number;
  currentROI: number;
  projectedROI: number;
  fullTakeROI: number;
}

export function calculateProjectCosts(
  project: ProjectArea,
  units: Unit[],
  laborRates: LaborRate[],
  mileageRates: MileageRate[]
) {
  // Calculate unit costs
  const unitCosts = project.units.map(projectUnit => {
    const unit = units.find(u => u.id === projectUnit.unitId);
    if (!unit) return { name: 'Unknown', cost: 0 };
    return {
      name: unit.name,
      unitCost: unit.cost,
      quantity: projectUnit.quantity,
      total: unit.cost * projectUnit.quantity,
      type: unit.type
    };
  });

  // Calculate labor costs
  const laborCosts = project.laborRates.map(projectLabor => {
    const rate = laborRates.find(r => r.id === projectLabor.laborRateId);
    if (!rate) return { name: 'Unknown', cost: 0 };
    return {
      name: rate.name,
      unitCost: rate.cost,
      quantity: projectLabor.quantity,
      total: rate.cost * projectLabor.quantity,
      type: rate.type
    };
  });

  // Calculate mileage costs
  const mileageCosts = project.mileageRates.map(projectMileage => {
    const rate = mileageRates.find(r => r.id === projectMileage.mileageRateId);
    if (!rate) return { name: 'Unknown', cost: 0 };
    const totalMiles = rate.distance * projectMileage.trips * 2; // Round trip
    return {
      name: `${rate.distance} miles (${projectMileage.trips} trips)`,
      unitCost: rate.costPerMile,
      quantity: totalMiles,
      total: totalMiles * rate.costPerMile,
      type: 'miles'
    };
  });

  const totalUnitsCost = unitCosts.reduce((sum, item) => sum + item.total, 0);
  const totalLaborCost = laborCosts.reduce((sum, item) => sum + item.total, 0);
  const totalMileageCost = mileageCosts.reduce((sum, item) => sum + item.total, 0);
  const totalCost = totalUnitsCost + totalLaborCost + totalMileageCost;

  const costPerHome = totalCost / project.homesPassed;
  const costPerCustomer = totalCost / project.currentCustomers;

  return {
    unitCosts,
    laborCosts,
    mileageCosts,
    totalUnitsCost,
    totalLaborCost,
    totalMileageCost,
    totalCost,
    costPerHome,
    costPerCustomer
  };
}

export function calculateROI(
  project: ProjectArea,
  totalCost: number,
  monthlyIncomePerCustomer: number,
  projectedGrowthPercentage: number
): ROICalculation {
  const currentTakeRate = (project.currentCustomers / project.homesPassed) * 100;
  const remainingHomes = project.homesPassed - project.currentCustomers;
  const projectedNewCustomers = Math.ceil(remainingHomes * (projectedGrowthPercentage / 100));
  const totalProjectedCustomers = project.currentCustomers + projectedNewCustomers;
  const projectedTakeRate = (totalProjectedCustomers / project.homesPassed) * 100;

  const annualIncomePerCustomer = monthlyIncomePerCustomer * 12;
  
  // ROI calculations (in years)
  const currentROI = totalCost / (annualIncomePerCustomer * project.currentCustomers);
  const projectedROI = totalCost / (annualIncomePerCustomer * totalProjectedCustomers);
  const fullTakeROI = totalCost / (annualIncomePerCustomer * project.homesPassed);

  return {
    currentTakeRate,
    projectedNewCustomers,
    totalProjectedCustomers,
    projectedTakeRate,
    currentROI,
    projectedROI,
    fullTakeROI
  };
}