import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Footer2 from './components/Footer2';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import AdminModal from './components/AdminModal';
import Admin from './pages/Admin';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import BottomNav from './components/BottomNav';
import ChatBot from './components/ChatBot';
import LoadingScreen from './components/LoadingScreen';
import { PageTransition } from './components/PageTransition';
import { CustomCursor } from './components/CustomCursor';
import { CommandPalette } from './components/CommandPalette';
import { ScrollProgress } from './components/ScrollProgress';
import { Spotlight } from './components/Spotlight';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      {!isLoading && (
        <div className="min-h-screen flex flex-col font-sans text-primary bg-background pb-16 md:pb-0">
          <CustomCursor />
          <ScrollProgress />
          <Spotlight />
          <CommandPalette />
          <ScrollToTop />
          <Navbar />
          <BottomNav />
          <AdminModal />
          <ChatBot />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
                <Route path="/projects/:slug" element={<PageTransition><ProjectDetail /></PageTransition>} />
                <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
                <Route path="/blogs/:slug" element={<PageTransition><BlogDetail /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
<Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
                <Route path="/test" element={<PageTransition><Test /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </main>
          {isHome ? <Footer /> : <Footer2 />}
        </div>
      )}
    </>
  );
}

export default App;
