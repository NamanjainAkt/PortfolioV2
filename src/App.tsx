import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import LoadingFallback from './components/LoadingFallback';
import { PageTransition } from './components/PageTransition';

const CommandPalette = lazy(() => import('./components/CommandPalette').then(m => ({ default: m.CommandPalette })));
const ChatBot = lazy(() => import('./components/ChatBot').then(m => ({ default: m.ChatBot })));

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
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
    const idle = w.requestIdleCallback;
    const prefetch = () => {
      import('./pages/Projects');
      import('./pages/Blogs');
      import('./pages/Contact');
    };
    if (idle) {
      const id = idle(prefetch);
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(prefetch, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-primary bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-background focus:outline-none"
      >
        Skip to content
      </a>
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AdminModal />
      {!isAdmin && (
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
      )}
      <main id="main-content" className="flex-grow">
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
      {!isAdmin && <Footer />}
      <Analytics />
    </div>
  );
}

export default App;
