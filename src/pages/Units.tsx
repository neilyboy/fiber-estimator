import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Department, Unit } from '../types';
import { PlusCircle, Trash2, Edit2, Save, X } from 'lucide-react';

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
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [newUnit, setNewUnit] = useState<{ [key: string]: { name: string; type: string; cost: number; description: string } }>({});

  useEffect(() => {
    fetchDepartments();
    fetchUnits();
  }, [fetchDepartments, fetchUnits]);

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
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-100">{department.name}</h2>
                      {department.description && (
                        <p className="text-gray-400 mt-1">{department.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingDepartment(department.id)}
                        className="p-2 text-emerald-500 hover:text-emerald-400"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => deleteDepartment(department.id)}
                        className="p-2 text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Units List */}
                <div className="space-y-4">
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
                              <p className="text-gray-400 text-sm mt-1">{unit.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-gray-300">
                              ${unit.cost} per {unit.type}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingUnit(unit.id)}
                                className="p-2 text-emerald-500 hover:text-emerald-400"
                              >
                                <Edit2 size={20} />
                              </button>
                              <button
                                onClick={() => deleteUnit(unit.id)}
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

                  {/* New Unit Input */}
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Unit Name"
                        value={newUnit[department.id]?.name || ''}
                        onChange={(e) =>
                          setNewUnit({
                            ...newUnit,
                            [department.id]: {
                              ...newUnit[department.id],
                              name: e.target.value,
                            },
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
                            [department.id]: {
                              ...newUnit[department.id],
                              description: e.target.value,
                            },
                          })
                        }
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg"
                      />
                      <select
                        value={newUnit[department.id]?.type || 'each'}
                        onChange={(e) =>
                          setNewUnit({
                            ...newUnit,
                            [department.id]: {
                              ...newUnit[department.id],
                              type: e.target.value,
                            },
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
                            [department.id]: {
                              ...newUnit[department.id],
                              cost: Number(e.target.value),
                            },
                          })
                        }
                        className="w-32 bg-gray-600 text-white px-4 py-2 rounded-lg"
                      />
                      <button
                        onClick={() => handleAddUnit(department.id)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-emerald-600 rounded-lg hover:bg-emerald-700"
                      >
                        <PlusCircle size={20} />
                        <span>Add Unit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}