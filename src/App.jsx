import { HashRouter, Routes, Route } from 'react-router-dom';
import StartScreen from './pages/Startscreen';
import SolarSystemScreen from './pages/SolarSystemscreen';
import PlanetDetailScreen from './pages/PlanetDetailScreen';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/solar-system" element={<SolarSystemScreen />} />
        <Route path="/planet/:planetId" element={<PlanetDetailScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

