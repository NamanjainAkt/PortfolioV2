import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Footer2 from './components/Footer2';
import AdminModal from './components/AdminModal';
import BottomNav from './components/BottomNav';
import ChatBot from './components/ChatBot';
import LoadingScreen from './components/LoadingScreen';
import LoadingFallback from './components/LoadingFallback';
import { PageTransition } from './components/PageTransition';
import { CustomCursor } from './components/CustomCursor';
import { CommandPalette } from './components/CommandPalette';
import { ScrollProgress } from './components/ScrollProgress';
import { Spotlight } from './components/Spotlight';

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const Test = lazy(() => import('./pages/Test'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
  const isAdmin = location.pathname.startsWith('/admin');

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
          {!isAdmin && <Navbar />}
          {!isAdmin && <BottomNav />}
          <AdminModal />
          <ChatBot />
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
          </main>
          {isHome ? <Footer /> : <Footer2 />}
        </div>
      )}
    </>
  );
}

export default App;
