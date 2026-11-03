import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './AppContext';
import { DecryptedText } from '../components/DecryptedText';
import { Navigation, PageId } from './Navigation';
import { HomePage } from '../features/home/HomePage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { MembersPage } from '../features/members/MembersPage';
import { EventsPage } from '../features/events/EventsPage';
import { AttendancePage } from '../features/attendance/AttendancePage';
import { FinancePage } from '../features/finance/FinancePage';
import { MeetingsPage } from '../features/meetings/MeetingsPage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { ContactsPage } from '../features/contacts/ContactsPage';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { EventProposalPage } from '../features/events/EventProposalPage';
import { EventCompletionModal } from '../features/events/EventCompletionModal';
import { PublicEventsPage } from '../features/events/PublicEventsPage';
import { PhotoGalleryPage } from '../features/gallery/PhotoGalleryPage';
import { AboutUsPage } from '../features/about/AboutUsPage';

export const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [activeRole, setActiveRole] = useState<string>('Public View');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Automatically scroll to the very top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activePage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#080B11] flex items-center justify-center px-4 overflow-hidden">
        <div className="text-center space-y-4 max-w-5xl w-full">
          {/* Free-floating transparent Rotary Wheel with ambient pulse */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F7A81B] to-[#D41B2C] blur-2xl opacity-40 animate-pulse pointer-events-none" />
            <img
              src="/rotary-wheel.png"
              alt="Rotary International Wheel"
              className="relative w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(247,168,27,0.6)] animate-[spin_12s_linear_infinite]"
            />
          </div>
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-wider sm:tracking-widest uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            <DecryptedText text="ROTARACT CLUB OF ACROPOLIS ROYALS" speed={25} />
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#F7A81B] font-mono tracking-widest uppercase whitespace-nowrap">
            <DecryptedText text="Rotary International District 3040" speed={25} />
          </p>
        </div>
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'home': return <HomePage setActivePage={setActivePage} />;
      case 'dashboard': return <DashboardPage activeRole={activeRole} setActivePage={setActivePage} />;
      case 'events': return <PublicEventsPage />;
      case 'photo_gallery': return <PhotoGalleryPage />;
      case 'about_us': return <AboutUsPage />;
      case 'members': return <MembersPage />;
      case 'events_archive': return <EventsPage />;
      case 'event_proposal': return <EventProposalPage />;
      case 'meetings': return <MeetingsPage />;
      case 'reports': return <ReportsPage />;
      case 'contacts': return <ContactsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'finance': return <FinancePage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Executive Navigation with Pop-Up Hamburger Sidebar */}
      <Navigation 
        activePage={activePage} 
        setActivePage={setActivePage} 
        activeRole={activeRole}
        setActiveRole={setActiveRole}
      />

      {/* Main Content Layout with Cinematic Page Transitions */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <main className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full"
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <EventCompletionModal />

      {/* Persistent Footer */}
      <footer className="glass-panel border-t border-white/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Rotaract Club of Acropolis Royals. Built to last for generations of leaders.</p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
