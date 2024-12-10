import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Cable, Calculator, Home, List, Clock } from 'lucide-react';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Cable className="w-6 h-6" />
              <span className="font-bold">Fiber Cost Estimator</span>
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/units"
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700"
              >
                <List className="w-4 h-4" />
                <span>Units</span>
              </Link>
              <Link
                to="/labor-mileage"
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700"
              >
                <Clock className="w-4 h-4" />
                <span>Labor & Mileage</span>
              </Link>
              <Link
                to="/estimator"
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700"
              >
                <Calculator className="w-4 h-4" />
                <span>Estimator</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;