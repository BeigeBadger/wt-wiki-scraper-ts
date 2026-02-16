import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Vehicles } from './pages/Vehicles';
import { LineUpBuilder } from './pages/LineUpBuilder';

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route index element={<Home />} />
          <Route path="line-up-builder" element={<LineUpBuilder />} />
          <Route path="vehicles" element={<Vehicles />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
