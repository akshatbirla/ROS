import React, { useState } from 'react';
import { 
  Home, LayoutDashboard, Users, Calendar, UserCheck, DollarSign, 
  FileText, Award, BookOpen, BarChart3, Settings, Search, Sparkles, Menu, X, ChevronRight, Layers, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type PageId = 
  | 'home' | 'dashboard' | 'events' | 'photo_gallery' | 'about_us'
  | 'events_archive' | 'members' | 'event_proposal' | 'meetings' | 'reports' 
  | 'contacts' | 'analytics' | 'settings' | 'finance';

interface NavigationProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
}

const TOP_NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'photo_gallery', label: 'Photo Gallery', icon: FileText },
  { id: 'about_us', label: 'About Us', icon: BookOpen },
];

const SIDEBAR_ITEMS = [
  { id: 'members', label: 'Members', icon: Users },
  { id: 'events_archive', label: 'Events Archive', icon: Calendar },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'event_proposal', label: 'Events Manager', icon: FileText },
  { id: 'meetings', label: 'Meetings & MOM Archive', icon: Calendar },
  { id: 'reports', label: 'Reports', icon: Award },
  { id: 'contacts', label: 'External Roster & Directory', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const SIDEBAR_BOTTOM_ITEMS = [
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navigation: React.FC<NavigationProps> = ({ 
  activePage, 
  setActivePage,
  activeRole,
  setActiveRole
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isPublicView = activeRole === 'Public View';

  const handleNavClick = (pageId: PageId) => {
    setActivePage(pageId);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Left: Brand & Hamburger Button (hidden in Public View to prevent empty button) */}
          <div className="flex items-center gap-3">
            {!isPublicView && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Open Executive Sidebar"
                className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/10 cursor-pointer flex items-center justify-center shadow-sm"
              >
                <Menu className="w-5 h-5 text-[#F7A81B]" />
              </button>
            )}

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
              <img 
                src="/Club LOGO.png" 
                alt="Rotaract Club of Acropolis Royals" 
                className="w-10 h-10 object-contain drop-shadow-md rounded-lg"
              />
              <div className="hidden sm:block">
                <span className="text-sm font-extrabold text-white tracking-tight block">
                  Rotaract Club of Acropolis Royals
                </span>
                <span className="text-[10px] text-[#F7A81B] font-semibold flex items-center gap-1">
                  Rotary International District 3040
                </span>
              </div>
            </div>
          </div>

          {/* Center: Floating Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full bg-black/40 border border-white/10 shadow-lg backdrop-blur-md">
            {TOP_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as PageId)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F7A81B] to-[#D41B2C] text-black shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#F7A81B]" />
              <span className="font-semibold text-white">RY 2026-27</span>
            </div>

            <select
              value={activeRole}
              onChange={(e) => {
                setActiveRole(e.target.value);
                if (e.target.value === 'Public View') {
                  setIsSidebarOpen(false);
                }
              }}
              className="px-3 py-2 rounded-xl glass-panel text-xs text-slate-200 border border-white/10 focus:outline-none cursor-pointer hidden md:block"
            >
              <option value="Public View" className="bg-slate-900">🌍 Public View</option>
              <option value="President View" className="bg-slate-900">👑 President View</option>
              <option value="Secretary View" className="bg-slate-900">📝 Secretary View</option>
              <option value="Treasurer View" className="bg-slate-900">💰 Treasurer View</option>
              <option value="Member View" className="bg-slate-900">👤 Member View</option>
            </select>
          </div>
        </div>
      </header>

      {/* Slide-Out Pop-up Sidebar with Framer Motion (Only available in non-public views) */}
      <AnimatePresence>
        {!isPublicView && isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Content */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-84 max-w-[85vw] bg-[#0E131F] border-r border-white/10 p-6 flex flex-col justify-between shadow-2xl z-10 h-full overflow-hidden"
            >
              <div className="space-y-6 overflow-y-auto pr-1">
                {/* Drawer Top Header & Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/Club LOGO.png" 
                      alt="Club Logo" 
                      className="w-8 h-8 object-contain rounded-md"
                    />
                    <div>
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider">Acropolis Royals</h2>
                      <p className="text-[10px] text-[#F7A81B] font-semibold">{activeRole}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer flex items-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Top Nav items (visible only on small screens when sidebar is open) */}
                <div className="lg:hidden space-y-1 pb-4 border-b border-white/10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Pages</p>
                  {TOP_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id as PageId)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30' 
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#F7A81B]' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Items List */}
                <div className="space-y-1 overflow-y-auto pr-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 pt-2 lg:pt-0">Modules</p>
                  {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id as PageId)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30' 
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#F7A81B]' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    );
                  })}

                  <div className="pt-4 pb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 border-t border-white/10 pt-4">Configuration</p>
                    {SIDEBAR_BOTTOM_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activePage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id as PageId)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer mt-1 ${
                            isActive 
                              ? 'bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30' 
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#F7A81B]' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* System Status Info Card */}
                <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F7A81B] uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5" /> System Status
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Database (Supabase)</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Connected
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Institutional Year</span>
                      <span className="text-slate-200 font-semibold">2026-27</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Bottom Footer */}
              <div className="pt-4 border-t border-white/10 text-center mt-auto shrink-0">
                <p className="text-[10px] text-slate-500 font-mono">Rotaract Club of Acropolis Royals</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
