import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Vehicles } from './pages/Vehicles';
import { LineUpBuilder } from './pages/LineUpBuilder';

function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          classNames: {
            toast: '!bg-red-100 !border-red-300',
            title: '!text-red-700',
            description: '!text-red-600',
          },
        }}
      />
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
