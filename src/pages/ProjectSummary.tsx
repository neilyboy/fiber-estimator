import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { calculateProjectCosts, calculateROI } from '../utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart
} from 'recharts';
import { Printer, Edit, Users, TrendingUp } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

function ProjectSummary() {
  const { id } = useParams<{ id: string }>();
  const { 
    projects, 
    units, 
    laborRates, 
    mileageRates,
    departments,
    fetchDepartments 
  } = useStore();
  
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    // Fetch departments when component mounts
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return <div>Project not found</div>;
  }

  const {
    unitsByDepartment,
    laborCosts,
    mileageCosts,
    totalUnitsCost,
    totalLaborCost,
    totalMileageCost,
    totalCost
  } = calculateProjectCosts(project, units, laborRates, mileageRates);

  const {
    currentTakeRate,
    projectedNewCustomers,
    totalProjectedCustomers,
    projectedTakeRate,
    currentROI,
    projectedROI,
    fullTakeROI
  } = calculateROI(project, totalCost);

  const costPerHome = totalCost / project.homesPassed;
  const costPerCurrentCustomer = totalCost / project.currentCustomers;
  const costPerProjectedCustomer = totalCost / totalProjectedCustomers;

  const monthlyRevenue = project.currentCustomers * project.monthlyIncomePerCustomer;

  const costBreakdown = [
    { name: 'Materials & Equipment', value: totalUnitsCost },
    { name: 'Labor', value: totalLaborCost },
    { name: 'Mileage', value: totalMileageCost }
  ];

  const takeRateData = [
    { name: 'Current', customers: project.currentCustomers, takeRate: currentTakeRate.toFixed(1) },
    { name: 'Projected', customers: totalProjectedCustomers, takeRate: projectedTakeRate.toFixed(1) },
    { name: 'Full', customers: project.homesPassed, takeRate: 100 }
  ];

  return (
    <div className="space-y-8 pb-12 bg-gray-900">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">{project.name}</h1>
          <p className="mt-2 text-gray-400">{project.notes}</p>
        </div>
        <div className="flex items-center gap-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700"
          >
            <Printer size={20} />
            <span>Print</span>
          </button>
          <Link
            to={`/projects/${project.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-emerald-600 rounded-lg hover:bg-emerald-700"
          >
            <Edit size={20} />
            <span>Edit Project</span>
          </Link>
        </div>
      </div>

      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-64 object-cover rounded-lg"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-400">Total Cost</h3>
          <p className="mt-2 text-3xl font-bold text-gray-100">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-400">Current Take Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-100">{currentTakeRate.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-400">Projected Take Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-100">{projectedTakeRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">With {project.projectedGrowthPercentage}% growth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost per Home Analysis */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Cost per Home Analysis</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">100% Take Rate</h3>
              <p className="text-2xl font-bold text-indigo-600">
                ${(totalCost / project.homesPassed).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Based on {project.homesPassed} homes at 100%
              </p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">Current Take Rate</h3>
              <p className="text-2xl font-bold text-green-600">
                ${costPerCurrentCustomer.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Based on {project.currentCustomers} homes at {currentTakeRate.toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">Projected Take Rate</h3>
              <p className="text-2xl font-bold text-amber-600">
                ${costPerProjectedCustomer.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Based on {totalProjectedCustomers} homes at {projectedTakeRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100">ROI Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Homes Passed</h3>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {project.homesPassed.toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Current Customers</h3>
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {project.currentCustomers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                ${project.monthlyIncomePerCustomer.toFixed(2)} monthly revenue per customer
              </p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">Take Rate</h3>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {currentTakeRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400">ROI (Years)</h3>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-100 mt-2">
                {currentROI.toFixed(1)}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Based on ${project.monthlyIncomePerCustomer.toFixed(2)} monthly revenue per customer
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">Current ROI</h3>
              <p className="text-2xl font-bold text-indigo-600">
                {currentROI.toFixed(1)} years
              </p>
              <p className="text-sm text-gray-400">
                At {currentTakeRate.toFixed(1)}% take rate
              </p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">Projected ROI</h3>
              <p className="text-2xl font-bold text-green-600">
                {projectedROI.toFixed(1)} years
              </p>
              <p className="text-sm text-gray-400">
                At {projectedTakeRate.toFixed(1)}% take rate
              </p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">Full Take ROI</h3>
              <p className="text-2xl font-bold text-amber-600">
                {fullTakeROI.toFixed(1)} years
              </p>
              <p className="text-sm text-gray-400">
                At 100% take rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue and Take Rate Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Analysis */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Monthly Revenue Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400">Current Monthly Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-emerald-500">
                ${(project.currentCustomers * project.monthlyIncomePerCustomer).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">{project.currentCustomers} customers</p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400">Projected Monthly Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-amber-500">
                ${(totalProjectedCustomers * project.monthlyIncomePerCustomer).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">{totalProjectedCustomers} customers</p>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400">Full Take Monthly Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-500">
                ${(project.homesPassed * project.monthlyIncomePerCustomer).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">{project.homesPassed} potential customers</p>
            </div>
          </div>
        </div>

        {/* Take Rate Analysis */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Take Rate Analysis</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Customers</span>
              <span className="text-gray-100">{project.currentCustomers} homes</span>
              <span className="text-gray-100">{currentTakeRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Projected Growth</span>
              <span className="text-gray-100">+{projectedNewCustomers} homes</span>
              <span className="text-gray-100">{projectedTakeRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Full Take Rate</span>
              <span className="text-gray-100">{project.homesPassed} homes</span>
              <span className="text-gray-100">100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-gray-100">Cost Breakdown</h2>
          {/* Materials & Equipment by Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(unitsByDepartment).map(([deptId, deptUnits]) => {
              const department = departments.find(d => d.id === deptId);
              const departmentTotal = deptUnits.reduce((sum, unit) => sum + unit.total, 0);
              
              return (
                <div key={deptId} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-200">
                      {department?.name || 'Unknown Department'}
                    </h3>
                    <span className="text-lg font-semibold text-emerald-400">
                      ${departmentTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2 bg-gray-800/50 p-3 rounded-lg">
                    {deptUnits.map((unit, index) => (
                      <div key={index} className="flex justify-between text-gray-300 items-center">
                        <div className="flex flex-col">
                          <span className="font-medium">{unit.name}</span>
                          <span className="text-sm text-gray-400">
                            {unit.quantity} {unit.type} × ${unit.unitCost}
                          </span>
                        </div>
                        <span className="font-medium">${unit.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Labor Costs */}
          {laborCosts.length > 0 && (
            <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-200">Labor</h3>
                <span className="text-lg font-semibold text-emerald-400">
                  ${totalLaborCost.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2 bg-gray-800/50 p-3 rounded-lg">
                {laborCosts.map((labor, index) => (
                  <div key={index} className="flex justify-between text-gray-300 items-center">
                    <div className="flex flex-col">
                      <span className="font-medium">{labor.name}</span>
                      <span className="text-sm text-gray-400">
                        {labor.quantity} {labor.type} × ${labor.unitCost}
                      </span>
                    </div>
                    <span className="font-medium">${labor.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mileage Costs */}
          {mileageCosts.length > 0 && (
            <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-200">Mileage</h3>
                <span className="text-lg font-semibold text-emerald-400">
                  ${totalMileageCost.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2 bg-gray-800/50 p-3 rounded-lg">
                {mileageCosts.map((mileage, index) => (
                  <div key={index} className="flex justify-between text-gray-300 items-center">
                    <div className="flex flex-col">
                      <span className="font-medium">{mileage.name}</span>
                      <span className="text-sm text-gray-400">
                        {mileage.quantity} miles × ${mileage.unitCost}/mile
                      </span>
                    </div>
                    <span className="font-medium">${mileage.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="flex justify-between text-xl font-bold">
              <span className="text-gray-200">Total Project Cost</span>
              <span className="text-emerald-400">${totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectSummary;