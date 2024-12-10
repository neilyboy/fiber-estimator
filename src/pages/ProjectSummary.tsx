import React from 'react';
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
    mileageRates
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
  } = calculateROI(project, totalCost);

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
                ${costPerHome.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                Based on {project.homesPassed} homes
              </p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">Current Take Rate</h3>
              <p className="text-2xl font-bold text-green-600">
                ${(totalCost / project.currentCustomers).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                At {currentTakeRate.toFixed(1)}% take rate
              </p>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold">Projected Take Rate</h3>
              <p className="text-2xl font-bold text-amber-600">
                ${(totalCost / totalProjectedCustomers).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                At {projectedTakeRate.toFixed(1)}% take rate
              </p>
            </div>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100">ROI Analysis</h2>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Current Monthly Revenue</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${((project.monthlyIncomePerCustomer || 0) * project.currentCustomers).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  {project.currentCustomers} customers
                </p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Projected Monthly Revenue</h3>
                <p className="text-2xl font-bold text-amber-600">
                  ${((project.monthlyIncomePerCustomer || 0) * totalProjectedCustomers).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  {totalProjectedCustomers} customers
                </p>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Full Take Monthly Revenue</h3>
              <p className="text-2xl font-bold text-indigo-600">
                ${((project.monthlyIncomePerCustomer || 0) * project.homesPassed).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">
                {project.homesPassed} potential customers
              </p>
            </div>
          </div>
        </div>

        {/* Take Rate Analysis Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Take Rate Analysis</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Current Customers</h3>
                <p className="text-gray-400">{project.currentCustomers} homes</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">Take Rate</h3>
                <p className="text-gray-400">{currentTakeRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Projected Growth</h3>
                <p className="text-gray-400">+{projectedNewCustomers} homes</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">New Take Rate</h3>
                <p className="text-gray-400">{projectedTakeRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={takeRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#9CA3AF' }}
                  />
                  <Bar dataKey="takeRate" fill="#4f46e5" name="Take Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Cost Breakdown</h2>
          <div className="space-y-6">
            {/* Materials & Equipment */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Materials & Equipment</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-400">Item</th>
                    <th className="px-4 py-2 text-right text-gray-400">Quantity</th>
                    <th className="px-4 py-2 text-right text-gray-400">Unit Cost</th>
                    <th className="px-4 py-2 text-right text-gray-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {unitCosts.map((cost, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-gray-400">{cost.name}</td>
                      <td className="px-4 py-2 text-right text-gray-400">{cost.quantity} {cost.type}</td>
                      <td className="px-4 py-2 text-right text-gray-400">${cost.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right text-gray-400">${cost.total.toLocaleString()}</td>
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
                    <th className="px-4 py-2 text-left text-gray-400">Type</th>
                    <th className="px-4 py-2 text-right text-gray-400">Quantity</th>
                    <th className="px-4 py-2 text-right text-gray-400">Rate</th>
                    <th className="px-4 py-2 text-right text-gray-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {laborCosts.map((cost, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-gray-400">{cost.name}</td>
                      <td className="px-4 py-2 text-right text-gray-400">{cost.quantity} {cost.type}s</td>
                      <td className="px-4 py-2 text-right text-gray-400">${cost.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right text-gray-400">${cost.total.toLocaleString()}</td>
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
                    <th className="px-4 py-2 text-left text-gray-400">Distance</th>
                    <th className="px-4 py-2 text-right text-gray-400">Total Miles</th>
                    <th className="px-4 py-2 text-right text-gray-400">Rate</th>
                    <th className="px-4 py-2 text-right text-gray-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mileageCosts.map((cost, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-gray-400">{cost.name}</td>
                      <td className="px-4 py-2 text-right text-gray-400">{cost.quantity}</td>
                      <td className="px-4 py-2 text-right text-gray-400">${cost.unitCost.toFixed(2)}/mile</td>
                      <td className="px-4 py-2 text-right text-gray-400">${cost.total.toLocaleString()}</td>
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