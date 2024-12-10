import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash } from 'lucide-react';
import { useStore } from '../store/useStore';

function ProjectEstimator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const units = useStore((state) => state.units);
  const laborRates = useStore((state) => state.laborRates);
  const mileageRates = useStore((state) => state.mileageRates);
  const projects = useStore((state) => state.projects);
  const addProject = useStore((state) => state.addProject);
  const updateProject = useStore((state) => state.updateProject);
  const deleteProject = useStore((state) => state.deleteProject);

  const [initialValues, setInitialValues] = useState({
    id: '',
    name: '',
    imageUrl: '',
    homesPassed: 0,
    currentCustomers: 0,
    notes: '',
    monthlyIncomePerCustomer: 0,
    projectedGrowthPercentage: 0,
    units: [],
    laborRates: [],
    mileageRates: []
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === id);
      if (project) {
        setInitialValues({
          id: project.id,
          name: project.name,
          imageUrl: project.imageUrl || '',
          homesPassed: project.homesPassed || 0,
          currentCustomers: project.currentCustomers || 0,
          notes: project.notes || '',
          monthlyIncomePerCustomer: project.monthlyIncomePerCustomer || 0,
          projectedGrowthPercentage: project.projectedGrowthPercentage || 0,
          units: project.units.map(u => ({
            id: u.unitId,
            quantity: u.quantity
          })),
          laborRates: project.laborRates.map(r => ({
            id: r.laborRateId,
            quantity: r.quantity
          })),
          mileageRates: project.mileageRates.map(r => ({
            id: r.mileageRateId,
            trips: r.trips
          }))
        });
      }
    }
  }, [id, projects]);

  const handleAddUnit = () => {
    setInitialValues({
      ...initialValues,
      units: [...initialValues.units, { id: '', quantity: 0 }]
    });
  };

  const handleAddLabor = () => {
    setInitialValues({
      ...initialValues,
      laborRates: [...initialValues.laborRates, { id: '', quantity: 0 }]
    });
  };

  const handleAddMileage = () => {
    setInitialValues({
      ...initialValues,
      mileageRates: [...initialValues.mileageRates, { id: '', trips: 0 }]
    });
  };

  const handleRemoveUnit = (index: number) => {
    setInitialValues({
      ...initialValues,
      units: initialValues.units.filter((_, i) => i !== index)
    });
  };

  const handleRemoveLabor = (index: number) => {
    setInitialValues({
      ...initialValues,
      laborRates: initialValues.laborRates.filter((_, i) => i !== index)
    });
  };

  const handleRemoveMileage = (index: number) => {
    setInitialValues({
      ...initialValues,
      mileageRates: initialValues.mileageRates.filter((_, i) => i !== index)
    });
  };

  const handleUnitChange = (index: number, field: string, value: string | number) => {
    const newUnits = [...initialValues.units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    setInitialValues({ ...initialValues, units: newUnits });
  };

  const handleLaborChange = (index: number, field: string, value: string | number) => {
    const newLabor = [...initialValues.laborRates];
    newLabor[index] = { ...newLabor[index], [field]: value };
    setInitialValues({ ...initialValues, laborRates: newLabor });
  };

  const handleMileageChange = (index: number, field: string, value: string | number) => {
    const newMileage = [...initialValues.mileageRates];
    newMileage[index] = { ...newMileage[index], [field]: value };
    setInitialValues({ ...initialValues, mileageRates: newMileage });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      id: initialValues.id,
      name: initialValues.name,
      imageUrl: initialValues.imageUrl,
      homesPassed: initialValues.homesPassed,
      currentCustomers: initialValues.currentCustomers,
      notes: initialValues.notes,
      monthlyIncomePerCustomer: initialValues.monthlyIncomePerCustomer,
      projectedGrowthPercentage: initialValues.projectedGrowthPercentage,
      units: initialValues.units.map(u => ({
        unitId: u.id,
        quantity: u.quantity
      })),
      laborRates: initialValues.laborRates.map(l => ({
        laborRateId: l.id,
        quantity: l.quantity
      })),
      mileageRates: initialValues.mileageRates.map(m => ({
        mileageRateId: m.id,
        trips: m.trips
      }))
    };
    
    try {
      if (id) {
        await updateProject(projectData);
      } else {
        await addProject(projectData);
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleDelete = async () => {
    if (id) {
      await deleteProject(id);
      navigate('/');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">
          {id ? 'Edit Project' : 'New Project'}
        </h1>
        {id && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Trash size={20} />
            <span>Delete Project</span>
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Delete Project?</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-300 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Trash size={20} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={initialValues.name}
                onChange={(e) =>
                  setInitialValues({ ...initialValues, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Homes Passed
              </label>
              <input
                type="number"
                value={initialValues.homesPassed}
                onChange={(e) =>
                  setInitialValues({
                    ...initialValues,
                    homesPassed: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Current Customers
              </label>
              <input
                type="number"
                value={initialValues.currentCustomers}
                onChange={(e) =>
                  setInitialValues({
                    ...initialValues,
                    currentCustomers: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Monthly Income per Customer
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={initialValues.monthlyIncomePerCustomer}
                  onChange={(e) =>
                    setInitialValues({
                      ...initialValues,
                      monthlyIncomePerCustomer: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                  min="0"
                  step="0.01"
                />
                <span className="ml-2 text-gray-400">$ per month</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Projected Growth Rate
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={initialValues.projectedGrowthPercentage}
                  onChange={(e) =>
                    setInitialValues({
                      ...initialValues,
                      projectedGrowthPercentage: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="ml-2 text-gray-400">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={initialValues.imageUrl}
                onChange={(e) =>
                  setInitialValues({ ...initialValues, imageUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Notes
              </label>
              <textarea
                value={initialValues.notes}
                onChange={(e) =>
                  setInitialValues({ ...initialValues, notes: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Materials & Equipment Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Materials & Equipment</h2>
            <button
              type="button"
              onClick={handleAddUnit}
              className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              <Plus size={20} />
              <span>Add Unit</span>
            </button>
          </div>

          <div className="space-y-4">
            {initialValues.units.map((unit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <select
                    value={unit.id}
                    onChange={(e) => handleUnitChange(index, 'id', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                    required
                  >
                    <option value="">Select a unit</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (${u.cost}/{u.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={unit.quantity}
                    onChange={(e) =>
                      handleUnitChange(index, 'quantity', parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Quantity"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveUnit(index)}
                  className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600"
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Labor Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Labor</h2>
            <button
              type="button"
              onClick={handleAddLabor}
              className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              <Plus size={20} />
              <span>Add Labor</span>
            </button>
          </div>

          <div className="space-y-4">
            {initialValues.laborRates.map((labor, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <select
                    value={labor.id}
                    onChange={(e) => handleLaborChange(index, 'id', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                    required
                  >
                    <option value="">Select labor rate</option>
                    {laborRates.map((rate) => (
                      <option key={rate.id} value={rate.id}>
                        {rate.name} (${rate.cost}/{rate.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={labor.quantity}
                    onChange={(e) =>
                      handleLaborChange(index, 'quantity', parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Hours"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLabor(index)}
                  className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600"
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mileage Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Mileage</h2>
            <button
              type="button"
              onClick={handleAddMileage}
              className="flex items-center gap-2 px-4 py-2 text-gray-100 bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              <Plus size={20} />
              <span>Add Mileage</span>
            </button>
          </div>

          <div className="space-y-4">
            {initialValues.mileageRates.map((mileage, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <select
                    value={mileage.id}
                    onChange={(e) => handleMileageChange(index, 'id', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                    required
                  >
                    <option value="">Select mileage rate</option>
                    {mileageRates.map((rate) => (
                      <option key={rate.id} value={rate.id}>
                        {rate.distance} miles (${rate.costPerMile}/mile)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={mileage.trips}
                    onChange={(e) =>
                      handleMileageChange(index, 'trips', parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-emerald-500"
                    placeholder="Trips"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMileage(index)}
                  className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600"
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            to="/"
            className="px-4 py-2 text-gray-400 hover:text-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            {id ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectEstimator;