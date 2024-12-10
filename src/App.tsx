import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Units from './pages/Units';
import LaborMileage from './pages/LaborMileage';
import ProjectEstimator from './pages/ProjectEstimator';
import ProjectSummary from './pages/ProjectSummary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="units" element={<Units />} />
          <Route path="labor-mileage" element={<LaborMileage />} />
          <Route path="estimator" element={<ProjectEstimator />} />
          <Route path="estimator/:id" element={<ProjectEstimator />} />
          <Route path="summary/:id" element={<ProjectSummary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;