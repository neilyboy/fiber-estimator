import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Units from './pages/Units';
import LaborMileage from './pages/LaborMileage';
import ProjectEstimator from './pages/ProjectEstimator';
import ProjectSummary from './pages/ProjectSummary';
import AnnualEstimator from './pages/AnnualEstimator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="units" element={<Units />} />
          <Route path="labor-mileage" element={<LaborMileage />} />
          <Route path="estimator" element={<ProjectEstimator />} />
          <Route path="projects/:id/edit" element={<ProjectEstimator />} />
          <Route path="summary/:id" element={<ProjectSummary />} />
          <Route path="annual-estimator" element={<AnnualEstimator />} />
          <Route path="annual-estimator/:id" element={<AnnualEstimator />} />
          <Route path="annual-estimator/:id/edit" element={<AnnualEstimator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;