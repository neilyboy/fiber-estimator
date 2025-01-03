import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { calculateProjectCosts, calculateSimpleROI } from '../utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function AnnualEstimator() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    projects,
    annualProjects,
    fetchAnnualProjects,
    saveAnnualProject,
    updateAnnualProject,
    deleteAnnualProject,
    units,
    laborRates,
    mileageRates,
    departments,
    fetchDepartments
  } = useStore();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    notes: '',
    projectIds: [] as string[]
  });

  useEffect(() => {
    fetchAnnualProjects();
    fetchDepartments();
  }, [fetchAnnualProjects, fetchDepartments]);

  useEffect(() => {
    if (id) {
      const annualProject = annualProjects.find(p => p.id === id);
      if (annualProject) {
        setFormData({
          id: annualProject.id,
          name: annualProject.name,
          notes: annualProject.notes || '',
          projectIds: annualProject.projectIds
        });
      }
    }
  }, [id, annualProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateAnnualProject({
          id,
          name: formData.name,
          notes: formData.notes,
          projectIds: formData.projectIds
        });
        // Don't navigate away when updating
      } else {
        await saveAnnualProject({
          name: formData.name,
          notes: formData.notes,
          projectIds: formData.projectIds
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to save annual project:', error);
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteAnnualProject(id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete annual project:', error);
      }
    }
  };

  const handleProjectToggle = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      projectIds: prev.projectIds.includes(projectId)
        ? prev.projectIds.filter(id => id !== projectId)
        : [...prev.projectIds, projectId]
    }));
  };

  const calculateTotalCosts = () => {
    let totalMaterials = 0;
    let totalLabor = 0;
    let totalMileage = 0;
    let totalHomes = 0;
    let totalCurrentCustomers = 0;
    let totalMonthlyRevenue = 0;
    let totalProjectedGrowthRate = 0;
    let projectCount = 0;
    const departmentCosts: Record<string, number> = {};
    const unitTotals: Record<string, { quantity: number; cost: number; unitId: string }> = {};

    formData.projectIds.forEach(projectId => {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        const costs = calculateProjectCosts(project, units, laborRates, mileageRates);
        const monthlyRevenue = project.currentCustomers * (project.monthlyIncomePerCustomer || 0);
        
        totalMaterials += costs.totalUnitsCost;
        totalLabor += costs.totalLaborCost;
        totalMileage += costs.totalMileageCost;
        totalHomes += project.homesPassed;
        totalCurrentCustomers += project.currentCustomers;
        totalMonthlyRevenue += monthlyRevenue;
        
        // Add to projected growth rate calculation
        if (project.projectedGrowthRate !== undefined && project.projectedGrowthRate > 0) {
          totalProjectedGrowthRate += project.projectedGrowthRate;
          projectCount++;
        }

        // Calculate department costs and unit totals
        project.units.forEach(projectUnit => {
          const unit = units.find(u => u.id === projectUnit.unitId);
          if (unit) {
            const deptId = unit.departmentId;
            const unitCost = unit.cost * projectUnit.quantity;
            
            departmentCosts[deptId] = (departmentCosts[deptId] || 0) + unitCost;
            
            const key = `${unit.id}-${unit.name}`;
            if (!unitTotals[key]) {
              unitTotals[key] = { quantity: 0, cost: 0, unitId: unit.id };
            }
            unitTotals[key].quantity += projectUnit.quantity;
            unitTotals[key].cost += unitCost;
          }
        });
      }
    });

    const totalCost = totalMaterials + totalLabor + totalMileage;
    const averageCostPerHome = totalHomes > 0 ? totalCost / totalHomes : 0;
    const currentTakeRate = totalHomes > 0 ? (totalCurrentCustomers / totalHomes) * 100 : 0;
    
    // Calculate average projected growth rate - default to 30% if none specified
    const averageProjectedGrowthRate = projectCount > 0 ? totalProjectedGrowthRate / projectCount : 30;
    
    // Calculate projected new customers based on remaining homes and growth rate
    const remainingHomes = totalHomes - totalCurrentCustomers;
    const projectedNewCustomers = Math.floor(remainingHomes * (averageProjectedGrowthRate / 100));
    const totalProjectedCustomers = totalCurrentCustomers + projectedNewCustomers;
    const projectedTakeRate = totalHomes > 0 ? (totalProjectedCustomers / totalHomes) * 100 : 0;
    
    // Calculate monthly revenue for different scenarios
    const avgMonthlyIncomePerCustomer = totalCurrentCustomers > 0 ? totalMonthlyRevenue / totalCurrentCustomers : 0;
    const projectedMonthlyRevenue = totalProjectedCustomers * avgMonthlyIncomePerCustomer;
    const fullTakeMonthlyRevenue = totalHomes * avgMonthlyIncomePerCustomer;

    // Calculate ROI for different scenarios
    const currentROI = calculateSimpleROI(totalCost, totalMonthlyRevenue);
    const projectedROI = calculateSimpleROI(totalCost, projectedMonthlyRevenue);
    const fullTakeROI = calculateSimpleROI(totalCost, fullTakeMonthlyRevenue);

    return {
      totalMaterials,
      totalLabor,
      totalMileage,
      totalCost,
      totalHomes,
      totalCurrentCustomers,
      projectedNewCustomers,
      totalProjectedCustomers,
      currentTakeRate,
      projectedTakeRate,
      departmentCosts,
      unitTotals,
      averageCostPerHome,
      totalMonthlyRevenue,
      projectedMonthlyRevenue,
      fullTakeMonthlyRevenue,
      currentROI,
      projectedROI,
      fullTakeROI
    };
  };

  const totals = calculateTotalCosts();

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#8B5CF6'];

  // Create department pie data with consistent colors
  const departmentColorMap = departments.reduce((acc, dept, index) => {
    acc[dept.id] = COLORS[index % COLORS.length];
    return acc;
  }, {} as Record<string, string>);

  const departmentPieData = Object.entries(totals.departmentCosts)
    .map(([deptId, cost]) => {
      const dept = departments.find(d => d.id === deptId);
      return {
        id: deptId,
        name: dept?.name || 'Unknown',
        value: cost,
        color: departmentColorMap[deptId] || COLORS[0]
      };
    })
    .filter(item => item.value > 0);

  // Group units by department and calculate department totals
  const departmentBreakdowns = Object.entries(totals.unitTotals)
    .map(([key, data]) => {
      const [unitId, name] = key.split('-');
      const unit = units.find(u => u.id === data.unitId);
      const unitName = unit?.name || name;
      return {
        unitId: data.unitId,
        name: unitName,
        quantity: data.quantity,
        cost: data.cost,
        department: departments.find(d => d.id === unit?.departmentId)?.name || 'Unknown',
        departmentId: unit?.departmentId || 'unknown'
      };
    })
    .reduce((acc, unit) => {
      if (!acc[unit.department]) {
        acc[unit.department] = {
          units: [],
          totalCost: 0
        };
      }
      acc[unit.department].units.push(unit);
      acc[unit.department].totalCost += unit.cost;
      return acc;
    }, {} as Record<string, { units: any[], totalCost: number }>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">
          {id ? 'Edit Annual Project' : 'New Annual Project'}
        </h1>
        {id && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-red-500 hover:text-red-400"
          >
            <Trash className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Select Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border-2 cursor-pointer ${
                  formData.projectIds.includes(project.id)
                    ? 'border-emerald-500 bg-gray-700'
                    : 'border-gray-600 bg-gray-800'
                }`}
                onClick={() => handleProjectToggle(project.id)}
              >
                <h3 className="font-semibold text-gray-100">{project.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{project.notes}</p>
                <div className="mt-2 text-sm">
                  <span className="text-emerald-400">
                    {project.homesPassed.toLocaleString()} homes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {formData.projectIds.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Annual Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">Total Cost</div>
                <div className="text-2xl font-bold text-emerald-400">
                  ${totals.totalCost.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">Total Homes</div>
                <div className="text-2xl font-bold text-gray-100">
                  {totals.totalHomes.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">Current Customers</div>
                <div className="text-2xl font-bold text-gray-100">
                  {totals.totalCurrentCustomers.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">Take Rate</div>
                <div className="text-2xl font-bold text-gray-100">
                  {totals.currentTakeRate.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">Materials & Equipment</div>
                <div className="text-xl font-bold text-gray-100">
                  ${totals.totalMaterials.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">Labor</div>
                <div className="text-xl font-bold text-gray-100">
                  ${totals.totalLabor.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">Mileage</div>
                <div className="text-xl font-bold text-gray-100">
                  ${totals.totalMileage.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Project Breakdown</h3>
              <div className="space-y-4">
                {formData.projectIds.map(projectId => {
                  const project = projects.find(p => p.id === projectId);
                  if (!project) return null;
                  
                  const costs = calculateProjectCosts(project, units, laborRates, mileageRates);
                  const monthlyRevenue = project.currentCustomers * (project.monthlyIncomePerCustomer || 0);
                  const roi = calculateSimpleROI(costs.totalCost, monthlyRevenue);
                  const costPerHome = costs.totalCost / project.homesPassed;
                  
                  return (
                    <Link
                      key={project.id}
                      to={`/summary/${project.id}`}
                      className="block bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-medium text-gray-100">{project.name}</h4>
                        <div className="text-emerald-400 font-semibold">
                          ${costs.totalCost.toLocaleString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Materials & Equipment:</span>
                          <span className="text-gray-100 ml-2">${costs.totalUnitsCost.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Labor:</span>
                          <span className="text-gray-100 ml-2">${costs.totalLaborCost.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Mileage:</span>
                          <span className="text-gray-100 ml-2">${costs.totalMileageCost.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Homes Passed:</span>
                          <span className="text-gray-100 ml-2">{project.homesPassed.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Current Customers:</span>
                          <span className="text-gray-100 ml-2">{project.currentCustomers.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Take Rate:</span>
                          <span className="text-gray-100 ml-2">
                            {((project.currentCustomers / project.homesPassed) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Cost per Home:</span>
                          <span className="text-gray-100 ml-2">${costPerHome.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Monthly Revenue:</span>
                          <span className="text-gray-100 ml-2">${monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">ROI (Years):</span>
                          <span className="text-gray-100 ml-2">{roi.toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <Link
            to="/"
            className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            {id ? 'Update' : 'Create'} Annual Project
          </button>
        </div>
      </form>

      {/* Cost Analysis Charts */}
      <div className="mt-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Cost Analysis</h3>
        
        {/* Department Cost Distribution */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-100 mb-4">Materials & Equipment Cost Distribution</h4>
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <PieChart width={500} height={400}>
              <Pie
                data={departmentPieData}
                cx={250}
                cy={200}
                labelLine={false}
                label={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentPieData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#F3F4F6' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
            </PieChart>
            <div className="flex flex-col gap-2 pt-8">
              {departmentPieData.map((dept) => (
                <div key={dept.id} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-gray-100">{dept.name}: ${dept.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Breakdowns */}
        {Object.entries(departmentBreakdowns).map(([department, data]) => (
          <div key={department} className="bg-gray-700 rounded-lg p-4 mt-4">
            <div className="flex flex-col mb-4">
              <h4 className="text-md font-medium text-gray-100">{department} Breakdown</h4>
              <span className="text-xs text-gray-400 mt-1">
                Based on {totals.totalProjectedCustomers.toLocaleString()} projected customers at {totals.projectedTakeRate.toFixed(1)}% take rate
              </span>
              <span className="text-emerald-400 mt-2">Total: ${data.totalCost.toLocaleString()}</span>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-2 px-4 text-gray-400">Unit Name</th>
                    <th className="py-2 px-4 text-gray-400 text-right">Total Quantity</th>
                    <th className="py-2 px-4 text-gray-400 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data.units
                    .sort((a, b) => b.cost - a.cost)
                    .map((unit, index) => (
                      <tr key={index} className="border-b border-gray-600">
                        <td className="py-2 px-4 text-gray-100">{unit.name}</td>
                        <td className="py-2 px-4 text-gray-100 text-right">{unit.quantity.toLocaleString()}</td>
                        <td className="py-2 px-4 text-emerald-400 text-right">${unit.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        
        {/* Overall Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400">Average Cost per Home</div>
            <div className="text-xl font-bold text-emerald-400">
              ${(totals.totalCost / totals.totalProjectedCustomers).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Based on {totals.totalProjectedCustomers.toLocaleString()} projected customers
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400">Monthly Revenue</div>
            <div className="text-xl font-bold text-emerald-400">
              ${totals.projectedMonthlyRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Based on {totals.totalProjectedCustomers.toLocaleString()} projected customers at {totals.projectedTakeRate.toFixed(1)}% take rate
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400">ROI (Years)</div>
            <div className="text-xl font-bold text-emerald-400">
              {totals.projectedROI.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Based on {totals.totalProjectedCustomers.toLocaleString()} projected customers at ${(totals.projectedMonthlyRevenue / totals.totalProjectedCustomers).toFixed(2)} per customer
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {/* Full Take Rate (100%) */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">100% Take Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Cost per Home</div>
                <div className="text-2xl font-bold text-indigo-600">
                  ${totals.averageCostPerHome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on {totals.totalHomes.toLocaleString()} homes at 100%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Monthly Revenue</div>
                <div className="text-2xl font-bold text-indigo-600">
                  ${totals.fullTakeMonthlyRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on {totals.totalHomes.toLocaleString()} homes at 100%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">ROI (Years)</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {totals.fullTakeROI.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on avg. monthly revenue of ${(totals.fullTakeMonthlyRevenue / totals.totalHomes).toFixed(2)} per customer
                </div>
              </div>
            </div>
          </div>

          {/* Current Take Rate */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Current Take Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Cost per Home</div>
                <div className="text-2xl font-bold text-green-600">
                  ${(totals.totalCost / totals.totalCurrentCustomers).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on {totals.totalCurrentCustomers.toLocaleString()} homes at {totals.currentTakeRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Monthly Revenue</div>
                <div className="text-2xl font-bold text-green-600">
                  ${totals.totalMonthlyRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on {totals.totalCurrentCustomers.toLocaleString()} homes at {totals.currentTakeRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">ROI (Years)</div>
                <div className="text-2xl font-bold text-green-600">
                  {totals.currentROI.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on avg. monthly revenue of ${(totals.totalMonthlyRevenue / totals.totalCurrentCustomers).toFixed(2)} per customer
                </div>
              </div>
            </div>
          </div>

          {/* Projected Take Rate */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Projected Take Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Cost per Home</div>
                <div className="text-2xl font-bold text-amber-600">
                  ${(totals.totalCost / totals.totalProjectedCustomers).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on {totals.totalProjectedCustomers.toLocaleString()} homes at {totals.projectedTakeRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Monthly Revenue</div>
                <div className="text-2xl font-bold text-amber-600">
                  ${totals.projectedMonthlyRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on {totals.totalProjectedCustomers.toLocaleString()} homes at {totals.projectedTakeRate.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">ROI (Years)</div>
                <div className="text-2xl font-bold text-amber-600">
                  {totals.projectedROI.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Based on avg. monthly revenue of ${(totals.projectedMonthlyRevenue / totals.totalProjectedCustomers).toFixed(2)} per customer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Delete Annual Project?</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this annual project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnualEstimator;
