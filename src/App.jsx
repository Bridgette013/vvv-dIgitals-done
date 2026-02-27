import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home     from './pages/Home';
import AeroAdix from './pages/work/AeroAdix';
import Privacy  from './pages/Privacy';
import Terms    from './pages/Terms';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"              element={<Home />} />
      <Route path="/work/aeroadix" element={<AeroAdix />} />
      <Route path="/privacy"       element={<Privacy />} />
      <Route path="/terms"         element={<Terms />} />
    </Routes>
  </BrowserRouter>
);

export default App;
