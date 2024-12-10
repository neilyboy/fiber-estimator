import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { calculateProjectCosts, calculateROI } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Printer, Edit, Users, TrendingUp } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

function ProjectSummary() {
  const { id } = useParams<{ id: string }>();
  const { 
    projects, 
    units, 
    laborRates, 
    mileageRates, 
    monthlyIncomePerCustomer,
    projectedGrowthPercentage 
  } = useStore();
  
  const project = projects.find(p => p.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const {
    unitCosts,
    laborCosts,
    mileageCosts,
    totalUnitsCost,
    totalLaborCost,
    totalMileageCost,
    totalCost,
    costPerHome
  } = calculateProjectCosts(project, units, laborRates, mileageRates);

  const {
    currentTakeRate,
    projectedNewCustomers,
    totalProjectedCustomers,
    projectedTakeRate,
    currentROI,
    projectedROI,
    fullTakeROI
  } = calculateROI(project, totalCost, monthlyIncomePerCustomer, projectedGrowthPercentage);

  const costBreakdown = [
    { name: 'Materials & Equipment', value: totalUnitsCost },
    { name: 'Labor', value: totalLaborCost },
    { name: 'Mileage', value: totalMileageCost }
  ];

  const takeRateData = [
    { name: 'Current', customers: project.currentCustomers, takeRate: currentTakeRate },
    { name: 'Projected', customers: totalProjectedCustomers, takeRate: projectedTakeRate },
    { name: 'Full', customers: project.homesPassed, takeRate: 100 }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="mt-2 text-gray-600">{project.notes}</p>
        </div>
        <div className="flex space-x-4">
          <Link
            to={`/estimator/${id}`}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Project</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <Printer className="w-4 h-4" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-64 object-cover rounded-lg"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
          <p className="mt-2 text-3xl font-bold">${totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Cost per Home</h3>
          <p className="mt-2 text-3xl font-bold">${costPerHome.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Current Take Rate</h3>
          <p className="mt-2 text-3xl font-bold">{currentTakeRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Projected Take Rate</h3>
          <p className="mt-2 text-3xl font-bold">{projectedTakeRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Take Rate Analysis</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Current Customers</h3>
                <p className="text-gray-600">{project.currentCustomers} homes</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">Take Rate</h3>
                <p className="text-gray-600">{currentTakeRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Projected Growth</h3>
                <p className="text-gray-600">+{projectedNewCustomers} homes</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">New Take Rate</h3>
                <p className="text-gray-600">{projectedTakeRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={takeRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="takeRate" fill="#4f46e5" name="Take Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">ROI Analysis</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Current ROI</h3>
                <p className="text-2xl font-bold text-indigo-600">
                  {currentROI.toFixed(1)} years
                </p>
                <p className="text-sm text-gray-500">
                  Based on {project.currentCustomers} customers
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Projected ROI</h3>
                <p className="text-2xl font-bold text-green-600">
                  {projectedROI.toFixed(1)} years
                </p>
                <p className="text-sm text-gray-500">
                  Based on {totalProjectedCustomers} customers
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Full Take ROI</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {fullTakeROI.toFixed(1)} years
                </p >
                <p className="text-sm text-gray-500">
                  Based on {project.homesPassed} customers
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Monthly Revenue</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current</span>
                  <span>${(monthlyIncomePerCustomer * project.currentCustomers).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projected</span>
                  <span>${(monthlyIncomePerCustomer * totalProjectedCustomers).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Full Take</span>
                  <span>${(monthlyIncomePerCustomer * project.homesPassed).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Cost Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Cost Breakdown</h2>
          <div className="space-y-6">
            {/* Materials & Equipment */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Materials & Equipment</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Unit Cost</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {unitCosts.map((cost, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{cost.name}</td>
                      <td className="px-4 py-2 text-right">{cost.quantity} {cost.type}</td>
                      <td className="px-4 py-2 text-right">${cost.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">${cost.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Labor */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Labor</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Rate</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {laborCosts.map((cost, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{cost.name}</td>
                      <td className="px-4 py-2 text-right">{cost.quantity} {cost.type}s</td>
                      <td className="px-4 py-2 text-right">${cost.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">${cost.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mileage */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Mileage</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Distance</th>
                    <th className="px-4 py-2 text-right">Total Miles</th>
                    <th className="px-4 py-2 text-right">Rate</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mileageCosts.map((cost, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{cost.name}</td>
                      <td className="px-4 py-2 text-right">{cost.quantity}</td>
                      <td className="px-4 py-2 text-right">${cost.unitCost.toFixed(2)}/mile</td>
                      <td className="px-4 py-2 text-right">${cost.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectSummary;