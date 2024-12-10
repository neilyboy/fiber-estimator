import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Edit2, Clock, Car } from 'lucide-react';
import { LaborRate, MileageRate } from '../types';

function LaborMileage() {
  const { laborRates, mileageRates, addLaborRate, updateLaborRate, addMileageRate, updateMileageRate } = useStore();
  const [isEditingLabor, setIsEditingLabor] = useState(false);
  const [editingLaborRate, setEditingLaborRate] = useState<LaborRate | null>(null);
  const [isEditingMileage, setIsEditingMileage] = useState(false);
  const [editingMileageRate, setEditingMileageRate] = useState<MileageRate | null>(null);

  const handleLaborSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const rate = {
      id: editingLaborRate?.id || crypto.randomUUID(),
      name: formData.get('name') as string,
      type: formData.get('type') as 'hour' | 'day',
      cost: Number(formData.get('cost')),
    };

    if (editingLaborRate) {
      updateLaborRate(rate);
    } else {
      addLaborRate(rate);
    }
    setIsEditingLabor(false);
    setEditingLaborRate(null);
  };

  const handleMileageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const rate = {
      id: editingMileageRate?.id || crypto.randomUUID(),
      distance: Number(formData.get('distance')),
      costPerMile: Number(formData.get('costPerMile')),
    };

    if (editingMileageRate) {
      updateMileageRate(rate);
    } else {
      addMileageRate(rate);
    }
    setIsEditingMileage(false);
    setEditingMileageRate(null);
  };

  return (
    <div className="space-y-6 bg-gray-900">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">Labor & Mileage Management</h1>
      </div>

      {/* Labor Rates Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center text-gray-100">
            <Clock className="w-5 h-5 mr-2" />
            Labor Rates
          </h2>
          {!isEditingLabor && (
            <button
              onClick={() => setIsEditingLabor(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Labor Rate</span>
            </button>
          )}
        </div>

        {isEditingLabor && (
          <form onSubmit={handleLaborSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Rate Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingLaborRate?.name}
                  className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-gray-700 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Rate Type</label>
                <select
                  name="type"
                  required
                  defaultValue={editingLaborRate?.type || 'hour'}
                  className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-gray-700 text-gray-100"
                >
                  <option value="hour">Per Hour</option>
                  <option value="day">Per Day</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Cost</label>
                <input
                  type="number"
                  name="cost"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={editingLaborRate?.cost}
                  className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-gray-700 text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditingLabor(false);
                  setEditingLaborRate(null);
                }}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-400 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                {editingLaborRate ? 'Update' : 'Add'} Labor Rate
              </button>
            </div>
          </form>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rate Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-200">
            {laborRates.map((rate) => (
              <tr key={rate.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{rate.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-100">
                  Per {rate.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                  ${rate.cost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setEditingLaborRate(rate);
                      setIsEditingLabor(true);
                    }}
                    className="text-emerald-400 hover:text-emerald-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mileage Rates Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center text-gray-100">
            <Car className="w-5 h-5 mr-2" />
            Mileage Rates
          </h2>
          {!isEditingMileage && (
            <button
              onClick={() => setIsEditingMileage(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mileage Rate</span>
            </button>
          )}
        </div>

        {isEditingMileage && (
          <form onSubmit={handleMileageSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Distance from Home Office (miles)
                </label>
                <input
                  type="number"
                  name="distance"
                  required
                  min="0"
                  step="0.1"
                  defaultValue={editingMileageRate?.distance}
                  className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-gray-700 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  Cost per Mile
                </label>
                <input
                  type="number"
                  name="costPerMile"
                  required
                  min="0"
                  step="0.01"
                  defaultValue={editingMileageRate?.costPerMile}
                  className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-gray-700 text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditingMileage(false);
                  setEditingMileageRate(null);
                }}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-400 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                {editingMileageRate ? 'Update' : 'Add'} Mileage Rate
              </button>
            </div>
          </form>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Distance (miles)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Cost per Mile
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-200">
            {mileageRates.map((rate) => (
              <tr key={rate.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                  {rate.distance.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                  ${rate.costPerMile.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setEditingMileageRate(rate);
                      setIsEditingMileage(true);
                    }}
                    className="text-emerald-400 hover:text-emerald-600"
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

export default LaborMileage;