import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Admin from './pages/Admin';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-100 flex flex-col">
        <Background />
        <Navbar />
        
        <main className="flex-1 flex flex-col">
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/blog" element={<Blog />} />
             <Route path="/blog/:id" element={<BlogPost />} />
             <Route path="/admin" element={<Admin />} />
           </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;