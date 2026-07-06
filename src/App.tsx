import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Footer2 from './components/Footer2';
import AdminModal from './components/AdminModal';
import BottomNav from './components/BottomNav';
const LazyChatBot = lazy(() => import('./components/ChatBot'));
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

  const handleLoadingComplete = useCallback(() => setIsLoading(false), []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
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
          <Suspense fallback={null}>
            <LazyChatBot />
          </Suspense>
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Suspense fallback={<LoadingFallback />}><Home /></Suspense></PageTransition>} />
                <Route path="/projects" element={<PageTransition><Suspense fallback={<LoadingFallback />}><Projects /></Suspense></PageTransition>} />
                <Route path="/projects/:slug" element={<PageTransition><Suspense fallback={<LoadingFallback />}><ProjectDetail /></Suspense></PageTransition>} />
                <Route path="/blogs" element={<PageTransition><Suspense fallback={<LoadingFallback />}><Blogs /></Suspense></PageTransition>} />
                <Route path="/blogs/:slug" element={<PageTransition><Suspense fallback={<LoadingFallback />}><BlogDetail /></Suspense></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Suspense fallback={<LoadingFallback />}><Contact /></Suspense></PageTransition>} />
                <Route path="/admin" element={<PageTransition><Suspense fallback={<LoadingFallback />}><Admin /></Suspense></PageTransition>} />
                <Route path="*" element={<PageTransition><Suspense fallback={<LoadingFallback />}><NotFound /></Suspense></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </main>
          {isHome ? <Footer /> : <Footer2 />}
          <Analytics />
        </div>
      )}
    </>
  );
}

export default App;
