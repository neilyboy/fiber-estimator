import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Cable, ArrowRight } from 'lucide-react';

function Home() {
  const projects = useStore((state) => state.projects);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <Cable className="w-16 h-16 mx-auto text-indigo-600" />
        <h1 className="text-4xl font-bold text-gray-900">
          Fiber Project Cost Estimator
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Estimate and manage your fiber project costs efficiently with our
          comprehensive project planning tool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/units"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold flex items-center justify-between">
            Unit Management
            <ArrowRight className="w-5 h-5" />
          </h2>
          <p className="mt-2 text-gray-600">
            Manage your units and their associated costs
          </p>
        </Link>

        <Link
          to="/estimator"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold flex items-center justify-between">
            Project Estimator
            <ArrowRight className="w-5 h-5" />
          </h2>
          <p className="mt-2 text-gray-600">
            Create and manage your fiber project estimates
          </p>
        </Link>
      </div>

      {projects.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/summary/${project.id}`}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {project.homesPassed} homes passed • {project.currentCustomers}{' '}
                  current customers
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;