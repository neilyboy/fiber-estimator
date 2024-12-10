import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Edit2 } from 'lucide-react';

function Units() {
  const { 
    units, 
    addUnit, 
    updateUnit 
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">Units</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-emerald-600 rounded-lg hover:bg-emerald-700"
          >
            <Plus size={20} />
            <span>Add Unit</span>
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-100">
            {editingUnit ? 'Edit Unit' : 'Add New Unit'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Unit Name
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editingUnit?.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-100 bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Unit Type
              </label>
              <select
                name="type"
                required
                defaultValue={editingUnit?.type}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-100 bg-gray-700"
              >
                <option value="each">Per Each</option>
                <option value="foot">Per Foot</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Cost
              </label>
              <input
                type="number"
                name="cost"
                required
                min="0"
                step="0.01"
                defaultValue={editingUnit?.cost}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-100 bg-gray-700"
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
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-400 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-gray-100 rounded-md hover:bg-emerald-700"
            >
              {editingUnit ? 'Update' : 'Add'} Unit
            </button>
          </div>
        </form>
      )}

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                Unit Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-100 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-200">
            {units.map((unit) => (
              <tr key={unit.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{unit.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-100">
                  {unit.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                  ${unit.cost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setEditingUnit(unit);
                      setIsEditing(true);
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

export default Units;