import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Background from './components/Background';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ReleasesPage from './pages/ReleasesPage';
import DevicesPage from './pages/DevicesPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-100 flex flex-col">
        <Background />
        
        {/* Android Style App Structure */}
        <TopBar />
        
        <main className="flex-1 flex flex-col pt-20 pb-32">
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/skills" element={<SkillsPage />} />
             <Route path="/projects" element={<ProjectsPage />} />
             <Route path="/releases" element={<ReleasesPage />} />
             <Route path="/devices" element={<DevicesPage />} />
           </Routes>
        </main>

        <Navbar />
      </div>
    </Router>
  );
};

export default App;