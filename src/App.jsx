import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home          from './pages/Home';
import AeroAdix      from './pages/work/AeroAdix';
import PeriodicTable from './pages/work/PeriodicTable';
import AshbyVale     from './pages/work/AshbyVale';
import Contact       from './pages/Contact';
import Privacy       from './pages/Privacy';
import Terms         from './pages/Terms';
import Store         from './pages/Store';
import ProductPage   from './pages/ProductPage';
import ThankYou      from './pages/store/ThankYou';
import VaCalculator  from './pages/tools/VaCalculator';
import LicenseGate   from './components/store/LicenseGate';
import StorefrontStrike from './components/StorefrontStrike';

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/work/aeroadix"       element={<AeroAdix />} />
        <Route path="/work/periodic-table" element={<PeriodicTable />} />
        <Route path="/work/ashby-vale"     element={<AshbyVale />} />
        <Route path="/contact"             element={<Contact />} />
        <Route path="/privacy"             element={<Privacy />} />
        <Route path="/terms"               element={<Terms />} />
        <Route path="/strike"              element={<StorefrontStrike />} />
        <Route path="/store"               element={<Store />} />
        <Route path="/store/:slug"         element={<ProductPage />} />
        <Route path="/store/:slug/thank-you" element={<ThankYou />} />
        <Route
          path="/tools/va-calculator"
          element={
            <LicenseGate slug="va-toolkit">
              <VaCalculator />
            </LicenseGate>
          }
        />
      </Routes>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
