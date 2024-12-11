import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Cable, Calculator, Home, List, Clock, TrendingUp, Calendar } from 'lucide-react';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <span className="text-lg font-semibold text-gray-100">Fiber Cost Estimator</span>
            </Link>
            <div className="flex space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-gray-700 text-emerald-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-emerald-300'
                  }`
                }
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/units"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-gray-700 text-emerald-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-emerald-300'
                  }`
                }
              >
                <List className="w-4 h-4" />
                <span>Units</span>
              </NavLink>
              <NavLink
                to="/labor-mileage"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-gray-700 text-emerald-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-emerald-300'
                  }`
                }
              >
                <Clock className="w-4 h-4" />
                <span>Labor & Mileage</span>
              </NavLink>
              <NavLink
                to="/estimator"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-gray-700 text-emerald-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-emerald-300'
                  }`
                }
              >
                <Calculator className="w-4 h-4" />
                <span>Estimator</span>
              </NavLink>
              <NavLink
                to="/annual-estimator"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-gray-700 text-emerald-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-emerald-300'
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                <span>Annual Estimator</span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;