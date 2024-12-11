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
  // Organize units by department
  const unitsByDepartment = project.units.reduce((acc, projectUnit) => {
    const unit = units.find(u => u.id === projectUnit.unitId);
    if (!unit) return acc;
    
    const dept = unit.departmentId;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    
    acc[dept].push({
      name: unit.name,
      unitCost: unit.cost,
      quantity: projectUnit.quantity,
      total: unit.cost * projectUnit.quantity,
      type: unit.type,
      departmentId: unit.departmentId
    });
    
    return acc;
  }, {} as Record<string, Array<{
    name: string;
    unitCost: number;
    quantity: number;
    total: number;
    type: string;
    departmentId: string;
  }>>);

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
      total: rate.costPerMile * totalMiles,
      type: 'miles'
    };
  });

  const totalUnitsCost = Object.values(unitsByDepartment)
    .flat()
    .reduce((sum, item) => sum + item.total, 0);
  const totalLaborCost = laborCosts.reduce((sum, item) => sum + item.total, 0);
  const totalMileageCost = mileageCosts.reduce((sum, item) => sum + item.total, 0);
  const totalCost = totalUnitsCost + totalLaborCost + totalMileageCost;
  const costPerHome = totalCost / project.homesPassed;
  const costPerCustomer = totalCost / project.currentCustomers;

  return {
    unitsByDepartment,
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
): ROICalculation {
  const currentTakeRate = (project.currentCustomers / project.homesPassed) * 100;
  
  // Calculate projected customers based on growth rate
  const remainingPotentialCustomers = project.homesPassed - project.currentCustomers;
  const projectedGrowthDecimal = project.projectedGrowthPercentage / 100;
  const projectedNewCustomers = Math.ceil(remainingPotentialCustomers * projectedGrowthDecimal);
  const totalProjectedCustomers = project.currentCustomers + projectedNewCustomers;
  const projectedTakeRate = (totalProjectedCustomers / project.homesPassed) * 100;

  const annualIncomePerCustomer = project.monthlyIncomePerCustomer * 12;
  
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

export function calculateSimpleROI(totalCost: number, monthlyRevenue: number): number {
  if (monthlyRevenue <= 0) return 0;
  const annualRevenue = monthlyRevenue * 12;
  return totalCost / annualRevenue;
}