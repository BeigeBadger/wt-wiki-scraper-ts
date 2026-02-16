import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Vehicles } from './pages/Vehicles';
import { LineUpBuilder } from './pages/LineUpBuilder';

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="vehicles" element={<Vehicles />} />
      <Route path="line-up-builder" element={<LineUpBuilder />} />
    </Routes>
  );
}

export default App;
