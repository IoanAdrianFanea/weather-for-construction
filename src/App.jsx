import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import Locations from './pages/Locations';
import Settings from './pages/Settings';
import Forecast from './pages/Forecast';
import { Header } from './components/Header';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import Safety from './pages/Safety';

function App() {
  const [activeTab, setActiveTab] = useState('weather');

  const renderPage = () => {
    switch (activeTab) {
      case 'weather':
        return <Dashboard />;
      case 'locations':
        return <Locations />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      case 'forecast':
        return <Forecast />;
      case 'safety':
        return <Safety />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <Header location="Southbank Site A" projectStatus="On Schedule" setActiveTab={setActiveTab} />
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;