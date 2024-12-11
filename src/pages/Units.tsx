import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Department, Unit } from '../types';
import { PlusCircle, Trash2, Edit2, Save, X, ChevronRight, ChevronDown } from 'lucide-react';

export default function Units() {
  const { 
    departments, 
    fetchDepartments,
    units,
    fetchUnits,
    addDepartment, 
    updateDepartment, 
    deleteDepartment, 
    addUnit, 
    updateUnit, 
    deleteUnit 
  } = useStore();
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<string | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<string | null>(null);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [newUnit, setNewUnit] = useState<{ [key: string]: { name: string; type: string; cost: number; description: string } }>({});
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDepartments();
    fetchUnits();
  }, [fetchDepartments, fetchUnits]);

  const toggleDepartment = (departmentId: string) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  const handleAddDepartment = async () => {
    if (newDepartment.name.trim()) {
      await addDepartment(newDepartment);
      setNewDepartment({ name: '', description: '' });
    }
  };

  const handleAddUnit = async (departmentId: string) => {
    const unit = newUnit[departmentId];
    if (unit && unit.name.trim()) {
      await addUnit({
        ...unit,
        departmentId,
        quantity: 0,
      });
      setNewUnit({ ...newUnit, [departmentId]: { name: '', type: 'each', cost: 0, description: '' } });
    }
  };

  const handleUpdateDepartment = async (department: Department) => {
    await updateDepartment(department);
    setEditingDepartment(null);
  };

  const handleUpdateUnit = async (unit: Unit) => {
    await updateUnit(unit);
    setEditingUnit(null);
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    await deleteDepartment(departmentId);
    setDeletingDepartment(null);
  };

  const handleDeleteUnit = async (unitId: string) => {
    await deleteUnit(unitId);
    setDeletingUnit(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100">Departments & Units</h1>
        <button
          onClick={handleAddDepartment}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <PlusCircle size={20} />
          Add Department
        </button>
      </div>

      {/* New Department Input */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Department Name"
            value={newDepartment.name}
            onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDepartment.description}
            onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* Departments List */}
      <div className="space-y-6">
        {departments
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((department) => {
            const departmentUnits = units
              .filter(u => u.departmentId === department.id)
              .sort((a, b) => a.name.localeCompare(b.name));
            const isExpanded = expandedDepartments.has(department.id);

            return (
              <div key={department.id} className="bg-gray-800 rounded-lg p-6">
                {editingDepartment === department.id ? (
                  <div className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={department.name}
                      onChange={(e) => updateDepartment({ ...department, name: e.target.value })}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg"
                    />
                    <input
                      type="text"
                      value={department.description || ''}
                      onChange={(e) => updateDepartment({ ...department, description: e.target.value })}
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg"
                    />
                    <button
                      onClick={() => handleUpdateDepartment(department)}
                      className="p-2 text-emerald-500 hover:text-emerald-400"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => setEditingDepartment(null)}
                      className="p-2 text-red-500 hover:text-red-400"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="flex justify-between items-center mb-4 cursor-pointer"
                    onClick={() => toggleDepartment(department.id)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      <div>
                        <h2 className="text-xl font-bold text-gray-100">{department.name}</h2>
                        {department.description && (
                          <p className="text-gray-400 mt-1">{department.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setEditingDepartment(department.id)}
                        className="p-2 text-emerald-500 hover:text-emerald-400"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => setDeletingDepartment(department.id)}
                        className="p-2 text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Units List */}
                {isExpanded && (
                  <div className="space-y-4">
                    {/* New Unit Input */}
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          placeholder="Unit Name"
                          value={newUnit[department.id]?.name || ''}
                          onChange={(e) =>
                            setNewUnit({
                              ...newUnit,
                              [department.id]: { ...(newUnit[department.id] || { type: 'each', cost: 0, description: '' }), name: e.target.value }
                            })
                          }
                          className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          value={newUnit[department.id]?.description || ''}
                          onChange={(e) =>
                            setNewUnit({
                              ...newUnit,
                              [department.id]: { ...(newUnit[department.id] || { name: '', type: 'each', cost: 0 }), description: e.target.value }
                            })
                          }
                          className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg"
                        />
                        <select
                          value={newUnit[department.id]?.type || 'each'}
                          onChange={(e) =>
                            setNewUnit({
                              ...newUnit,
                              [department.id]: { ...(newUnit[department.id] || { name: '', cost: 0, description: '' }), type: e.target.value }
                            })
                          }
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                          <option value="each">Each</option>
                          <option value="foot">Foot</option>
                          <option value="hour">Hour</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Cost"
                          value={newUnit[department.id]?.cost || ''}
                          onChange={(e) =>
                            setNewUnit({
                              ...newUnit,
                              [department.id]: { ...(newUnit[department.id] || { name: '', type: 'each', description: '' }), cost: Number(e.target.value) }
                            })
                          }
                          className="w-32 bg-gray-600 text-white px-4 py-2 rounded-lg"
                        />
                        <button
                          onClick={() => handleAddUnit(department.id)}
                          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                        >
                          <PlusCircle size={20} />
                          Add Unit
                        </button>
                      </div>
                    </div>

                    {/* Units */}
                    {departmentUnits.map((unit) => (
                      <div key={unit.id} className="bg-gray-700 rounded-lg p-4">
                        {editingUnit === unit.id ? (
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={unit.name}
                              onChange={(e) => updateUnit({ ...unit, name: e.target.value })}
                              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg"
                            />
                            <input
                              type="text"
                              value={unit.description || ''}
                              onChange={(e) => updateUnit({ ...unit, description: e.target.value })}
                              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg"
                            />
                            <select
                              value={unit.type}
                              onChange={(e) => updateUnit({ ...unit, type: e.target.value })}
                              className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                            >
                              <option value="each">Each</option>
                              <option value="foot">Foot</option>
                              <option value="hour">Hour</option>
                            </select>
                            <input
                              type="number"
                              value={unit.cost}
                              onChange={(e) => updateUnit({ ...unit, cost: Number(e.target.value) })}
                              className="w-32 bg-gray-600 text-white px-4 py-2 rounded-lg"
                            />
                            <button
                              onClick={() => handleUpdateUnit(unit)}
                              className="p-2 text-emerald-500 hover:text-emerald-400"
                            >
                              <Save size={20} />
                            </button>
                            <button
                              onClick={() => setEditingUnit(null)}
                              className="p-2 text-red-500 hover:text-red-400"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-gray-100">{unit.name}</h3>
                              {unit.description && (
                                <p className="text-sm text-gray-400 mt-1">{unit.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-400">
                                {unit.cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} per {unit.type}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingUnit(unit.id)}
                                  className="p-2 text-emerald-500 hover:text-emerald-400"
                                >
                                  <Edit2 size={20} />
                                </button>
                                <button
                                  onClick={() => setDeletingUnit(unit.id)}
                                  className="p-2 text-red-500 hover:text-red-400"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Delete Department Confirmation Dialog */}
      {deletingDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Delete Department?</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this department? This will also delete all units in this department. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeletingDepartment(null)}
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDepartment(deletingDepartment)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Unit Confirmation Dialog */}
      {deletingUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Delete Unit?</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this unit? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeletingUnit(null)}
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUnit(deletingUnit)}
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