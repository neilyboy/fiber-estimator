import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Cable, ArrowRight, Plus, Edit, Search, ChevronDown } from 'lucide-react';
import { ProjectArea, AnnualProject } from '../types';

function Home() {
  const projects = useStore((state) => state.projects);
  const units = useStore((state) => state.units);
  const laborRates = useStore((state) => state.laborRates);
  const mileageRates = useStore((state) => state.mileageRates);
  const annualProjects = useStore((state) => state.annualProjects);
  const fetchAnnualProjects = useStore((state) => state.fetchAnnualProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllAnnualProjects, setShowAllAnnualProjects] = useState(false);

  useEffect(() => {
    fetchAnnualProjects();
  }, [fetchAnnualProjects]);

  const calculateTotalCost = (project: ProjectArea) => {
    let total = 0;

    // Calculate materials and equipment cost
    if (project.units) {
      total += project.units.reduce((sum, projectUnit) => {
        const unit = units.find(u => u.id === projectUnit.unitId);
        if (!unit) return sum;
        return sum + (projectUnit.quantity * unit.cost);
      }, 0);
    }

    // Calculate labor cost
    if (project.laborRates) {
      total += project.laborRates.reduce((sum, projectLabor) => {
        const labor = laborRates.find(l => l.id === projectLabor.laborRateId);
        if (!labor) return sum;
        return sum + (projectLabor.quantity * labor.cost);
      }, 0);
    }

    // Calculate mileage cost
    if (project.mileageRates) {
      total += project.mileageRates.reduce((sum, projectMileage) => {
        const mileage = mileageRates.find(m => m.id === projectMileage.mileageRateId);
        if (!mileage) return sum;
        return sum + (projectMileage.trips * mileage.costPerMile * mileage.distance);
      }, 0);
    }

    return total;
  };

  const filterProjects = (items: (ProjectArea | AnnualProject)[]) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredProjects = filterProjects(projects);
  const filteredAnnualProjects = filterProjects(annualProjects);
  const displayedProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 3);
  const displayedAnnualProjects = showAllAnnualProjects ? filteredAnnualProjects : filteredAnnualProjects.slice(0, 3);

  return (
    <div className="space-y-6 bg-gray-900">
      <div className="text-center space-y-4">
        <Cable className="w-16 h-16 mx-auto text-emerald-600" />
        <h1 className="text-4xl font-bold text-gray-100">
          Fiber Project Cost Estimator
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Create and manage cost estimates for your fiber optic projects.
          Track materials, labor, and mileage costs all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/estimator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus size={20} />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Search Box */}
      <div className="max-w-md mx-auto mt-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Projects Section */}
      {filteredProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <div
                key={project.id}
                className="relative group"
              >
                <Link
                  to={`/summary/${project.id}`}
                  className="block p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-100">{project.name}</h2>
                      <p className="mt-2 text-gray-400">{project.notes}</p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="text-gray-400">
                          {project.homesPassed.toLocaleString()} homes passed
                        </div>
                        <div className="font-semibold text-emerald-400">
                          ${calculateTotalCost(project).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  to={`/projects/${project.id}/edit`}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-emerald-400 rounded-full hover:bg-gray-700"
                >
                  <Edit size={20} />
                </Link>
              </div>
            ))}
          </div>
          {filteredProjects.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-100"
              >
                {showAllProjects ? 'Show Less' : 'Load More'}
                <ChevronDown className={`transform transition-transform ${showAllProjects ? 'rotate-180' : ''}`} size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Annual Projects Section */}
      {filteredAnnualProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Annual Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedAnnualProjects.map((project) => (
              <div
                key={project.id}
                className="relative group"
              >
                <Link
                  to={`/annual-estimator/${project.id}`}
                  className="block p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-100">{project.name}</h2>
                      <p className="mt-2 text-gray-400">{project.notes}</p>
                      <div className="mt-4 text-sm text-gray-400">
                        {project.projectIds.length} included projects
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  to={`/annual-estimator/${project.id}/edit`}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-emerald-400 rounded-full hover:bg-gray-700"
                >
                  <Edit size={20} />
                </Link>
              </div>
            ))}
          </div>
          {filteredAnnualProjects.length > 3 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllAnnualProjects(!showAllAnnualProjects)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-100"
              >
                {showAllAnnualProjects ? 'Show Less' : 'Load More'}
                <ChevronDown className={`transform transition-transform ${showAllAnnualProjects ? 'rotate-180' : ''}`} size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;