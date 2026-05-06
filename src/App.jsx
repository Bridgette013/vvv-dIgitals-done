import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home          from './pages/Home';
import AeroAdix      from './pages/work/AeroAdix';
import PeriodicTable from './pages/work/PeriodicTable';
import Contact       from './pages/Contact';
import Privacy       from './pages/Privacy';
import Terms         from './pages/Terms';

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/work/aeroadix"       element={<AeroAdix />} />
        <Route path="/work/periodic-table" element={<PeriodicTable />} />
        <Route path="/contact"             element={<Contact />} />
        <Route path="/privacy"             element={<Privacy />} />
        <Route path="/terms"               element={<Terms />} />
      </Routes>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
