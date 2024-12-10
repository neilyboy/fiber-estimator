import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Edit2, DollarSign, TrendingUp } from 'lucide-react';

function Units() {
  const { 
    units, 
    addUnit, 
    updateUnit, 
    monthlyIncomePerCustomer, 
    setMonthlyIncomePerCustomer,
    projectedGrowthPercentage,
    setProjectedGrowthPercentage 
  } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const unit = {
      id: editingUnit?.id || crypto.randomUUID(),
      name: formData.get('name') as string,
      type: formData.get('type') as 'each' | 'foot' | 'hour',
      cost: Number(formData.get('cost')),
    };

    if (editingUnit) {
      updateUnit(unit);
    } else {
      addUnit(unit);
    }
    setIsEditing(false);
    setEditingUnit(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Unit Management</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Unit</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Monthly Income per Customer
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={monthlyIncomePerCustomer}
              onChange={(e) => setMonthlyIncomePerCustomer(Number(e.target.value))}
              className="border rounded-md px-3 py-2 w-40"
              min="0"
              step="0.01"
            />
            <span className="text-gray-600">$ per month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Projected Growth Rate
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={projectedGrowthPercentage}
              onChange={(e) => setProjectedGrowthPercentage(Number(e.target.value))}
              className="border rounded-md px-3 py-2 w-40"
              min="0"
              max="100"
              step="1"
            />
            <span className="text-gray-600">%</span>
          </div>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold">
            {editingUnit ? 'Edit Unit' : 'Add New Unit'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit Name
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editingUnit?.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit Type
              </label>
              <select
                name="type"
                required
                defaultValue={editingUnit?.type}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="each">Per Each</option>
                <option value="foot">Per Foot</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cost
              </label>
              <input
                type="number"
                name="cost"
                required
                min="0"
                step="0.01"
                defaultValue={editingUnit?.cost}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingUnit(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {editingUnit ? 'Update' : 'Add'} Unit
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {units.map((unit) => (
              <tr key={unit.id}>
                <td className="px-6 py-4 whitespace-nowrap">{unit.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {unit.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${unit.cost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setEditingUnit(unit);
                      setIsEditing(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Units;