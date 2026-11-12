import { HashRouter, Routes, Route } from 'react-router-dom';
import Startscreen from './pages/Startscreen';
import SolarSystemscreen from './pages/SolarSystemscreen';
import PlanetDetailScreen from './pages/PlanetDetailScreen';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Startscreen />} />
        <Route path="/solar-system" element={<SolarSystemscreen />} />
        <Route path="/planet/:planetID" element={<PlanetDetailScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

