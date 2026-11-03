import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Award, Users, Calendar, ArrowRight, Star, HeartHandshake, Globe, BookOpen, X, FileText, CheckCircle2, Clock, Heart, MessageCircle, Share2, Info, Image as ImageIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PageId } from '../../app/Navigation';
import { useApp } from '../../app/AppContext';
import { BorderGlow } from '../../components/BorderGlow';
import { SpotlightCard } from '../../components/SpotlightCard';
import { Counter } from '../../components/Counter';
import { DepthCarousel } from '../../components/DepthCarousel';

interface HomePageProps {
  setActivePage: (page: PageId) => void;
}

const BOARD_MEMBERS = [
  { name: "Rtr. Akshat Sharma", role: "President", avenue: "Executive Board", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
  { name: "Rtr. Priya Verma", role: "Club Secretary", avenue: "Executive Board", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" },
  { name: "Rtr. Rohan Mehta", role: "Vice President", avenue: "Executive Board", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { name: "Rtr. Ananya Joshi", role: "Treasurer", avenue: "Executive Board", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
  { name: "Rtr. Devansh Saxena", role: "Director - Club Service", avenue: "Club Service", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
  { name: "Rtr. Ishita Gupta", role: "Director - Community Service", avenue: "Community Service", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
  { name: "Rtr. Kshitij Nair", role: "Director - Professional Development", avenue: "Professional Dev", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" },
  { name: "Rtr. Sanya Malhotra", role: "Director - International Service", avenue: "International Service", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" },
];

export const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
  const { appSettings, activeMembers, events } = useApp();
  const [isConstitutionOpen, setIsConstitutionOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<'article1' | 'article2' | 'article3' | 'article4'>('article1');
  const [showAllBOD, setShowAllBOD] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const displayedBOD = appSettings.boardOfDirectors && appSettings.boardOfDirectors.length > 0
    ? appSettings.boardOfDirectors
    : BOARD_MEMBERS.map((m, idx) => ({ id: `default-bod-${idx}`, ...m }));

  const happenedEvents = events.filter(e => e.status === 'happened');
  
  // Calculate Avg Attendance & Service Metrics
  const totalBeneficiaries = happenedEvents.reduce((acc, curr) => acc + (curr.beneficiaries || 0), 0);
  const totalRotaractors = happenedEvents.reduce((acc, curr) => acc + (curr.nominatedMemberIds?.length || 0), 0);
  const totalServiceHours = happenedEvents.reduce((acc, curr) => acc + ((curr.actualDurationHours || 2) * (curr.nominatedMemberIds?.length || 8)), 0);
  const totalAttendees = totalBeneficiaries + totalRotaractors;
  const avgAttendance = happenedEvents.length > 0 ? Math.round(totalAttendees / happenedEvents.length) : 0;

  // Calculate Avenue Counts
  const avenueCounts = happenedEvents.reduce((acc, curr) => {
    const av = curr.avenue || 'Other';
    acc[av] = (acc[av] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieDataRaw = [
    { name: 'Club Service', value: avenueCounts['Club Service'] || 0, color: '#F7A81B' },
    { name: 'Community Service', value: avenueCounts['Community Service'] || 0, color: '#34D399' },
    { name: 'Vocational Service', value: avenueCounts['Vocational Service'] || 0, color: '#38BDF8' },
    { name: 'International Service', value: avenueCounts['International Service'] || 0, color: '#D41B2C' },
    { name: 'Professional Dev', value: avenueCounts['Professional Dev'] || 0, color: '#A78BFA' },
  ];
  const pieData = pieDataRaw.filter(d => d.value > 0);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <BorderGlow className="rounded-3xl">
        <section className="relative rounded-[inherit] overflow-hidden glass-panel p-8 md:p-14 border border-white/10" style={{ backgroundImage: `url(${appSettings.heroBannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#F7A81B]/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#D41B2C]/15 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Logo placed on the right side, vertically centered */}
        <div className="absolute right-8 md:right-14 top-1/2 transform -translate-y-1/2 z-10 hidden sm:block">
          <img 
            src="/RAC LOGO Orang Colour.png" 
            alt="RAC Logo" 
            className="h-40 md:h-64 w-auto object-contain drop-shadow-2xl" 
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold text-[#F7A81B] text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Rotary Year 2026-27 • "CREATE LASTING IMPACT"
          </div>

          <motion.h1 
            initial={{ filter: 'blur(10px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Rotaract Club of <br />
            <span className="gold-gradient-text">Acropolis Royals</span>
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base md:text-xl font-bold text-white tracking-wide whitespace-nowrap"
          >
            शुद्धं शुभं सशक्तम् - <span className="text-emerald-400">CREATING IMPACT THROUGH INTEGRITY</span>
          </motion.h2>

          <p className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed">
            {appSettings.welcomeText}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePage('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F7A81B] to-[#D41B2C] text-slate-950 font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#F7A81B]/20 cursor-pointer"
            >
              Explore our Impact
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsConstitutionOpen(true)}
              className="px-6 py-3.5 rounded-xl glass-panel text-white font-medium hover:bg-white/10 transition-all border border-white/10 cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#F7A81B]" />
              View Club Constitution
            </motion.button>
          </div>
          </div>
        </section>
      </BorderGlow>

      {/* Key Metrics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Projects", val: happenedEvents.length, icon: Award, color: "text-[#F7A81B]", action: () => setActivePage('dashboard') },
          { label: "Beneficiaries", val: totalBeneficiaries, icon: HeartHandshake, color: "text-[#D41B2C]", action: () => setActivePage('dashboard') },
          { label: "Serving Hours", val: totalServiceHours > 0 ? `${totalServiceHours}+` : '0', icon: Clock, color: "text-amber-400", action: () => setActivePage('dashboard') },
          { label: "Years of Service", val: "6+", icon: Shield, color: "text-emerald-400", action: () => setActivePage('dashboard') },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={m.action}
              whileHover={{ y: -5, scale: 1.02 }}
              className="h-[140px] shadow-lg hover:shadow-xl hover:shadow-[#F7A81B]/10 rounded-2xl cursor-pointer"
            >
              <SpotlightCard className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/15 transition-all h-full">
                <div className="flex flex-col justify-between h-full">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{m.label}</p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {typeof m.val === 'string' && (m.val.endsWith('%') || m.val.endsWith('+')) ? (
                      <>{m.val}</>
                    ) : (
                      <Counter value={m.val as number} />
                    )}
                  </h3>
                </div>
                <div className={`p-4 rounded-xl bg-white/5 ${m.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </section>

      {/* WHO WE ARE Section */}
      <section className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F7A81B]/10 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20 z-0" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[#F7A81B] text-xs font-medium uppercase tracking-wider">
              <Info className="w-3.5 h-3.5" />
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">WHO <span className="text-[#F7A81B]">WE ARE ?</span></h2>
            <div className={`text-slate-300 leading-relaxed whitespace-pre-wrap ${
              (appSettings.whoWeAreText || '').length > 400 ? 'text-sm' : 
              (appSettings.whoWeAreText || '').length > 200 ? 'text-base' : 'text-lg'
            }`}>
              {appSettings.whoWeAreText || "We are a community of young leaders driven by the Rotary motto of \"Service Above Self\"..."}
            </div>
            <button 
              onClick={() => {
                setActivePage('about_us');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="px-6 py-2.5 rounded-xl border border-[#F7A81B]/30 text-[#F7A81B] font-bold text-sm hover:bg-[#F7A81B]/10 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl">
            <DepthCarousel images={appSettings?.whoWeAreImages?.length ? appSettings.whoWeAreImages : [
              "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"
            ]} />
          </div>
        </div>
      </section>

      {/* Flagship Events */}
      <section className="space-y-8 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Our <span className="text-[#D41B2C]">Flagship Projects</span></h2>
          <p className="text-slate-400 text-sm">Initiatives that define our impact and legacy in the community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(appSettings.flagshipProjects || []).map((item, idx) => (
            <motion.div 
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -10 }}
              onClick={() => setSelectedProject(item)}
              className="h-[450px] rounded-3xl relative overflow-hidden group cursor-pointer border border-white/10 shadow-xl"
            >
              <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-[#080B11]/80 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
              
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-[60%] translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <h3 className="text-xl font-black text-white mb-2 drop-shadow-md">{item.title}</h3>
                <p className="text-white/90 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flagship Project Modal (Mounted directly to body via Portal) */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {selectedProject && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md" 
                  onClick={() => setSelectedProject(null)} 
                />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative max-w-4xl w-full bg-[#0E131F] border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]"
                >
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
                    <img 
                      src={selectedProject.img} 
                      alt={selectedProject.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-[#0E131F]/40 to-transparent" />
                    <button 
                      onClick={() => setSelectedProject(null)} 
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer z-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 md:p-8 -mt-20 relative z-10 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">{selectedProject.title}</h2>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-[#F7A81B] flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        About this Initiative
                      </h3>
                      <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner">
                        {selectedProject.about || selectedProject.desc}
                      </p>
                    </div>
                    
                    {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                      <div className="space-y-3 pt-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-pink-400" />
                          Gallery
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedProject.gallery.map((imgUrl: string, idx: number) => (
                            <div key={idx} className="h-40 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all">
                              <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </section>



      {/* Announcements & Theme Statement */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl space-y-4 border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#F7A81B]/10 text-[#F7A81B]">
                <Star className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Presidential Vision 2026-27</h2>
            </div>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium mt-4">
              "To build a Rotaract Club where integrity guides every decision, service creates lasting impact, sustainability becomes a way of life, and every member discovers the leader within themselves. Together, we will not just organize projects—we will transform lives, inspire change, and leave behind a legacy that truly matters."
            </p>
            <p className="text-sm text-[#F7A81B] font-semibold mt-4">— Rtr. Shuddha Kaushik | RY 2026 - 27</p>
          </div>
          {appSettings.presidentImage && (
            <img 
              src={appSettings.presidentImage} 
              alt="President" 
              className="absolute bottom-4 right-8 w-24 h-24 rounded-full border-2 border-[#F7A81B]/50 object-cover shadow-lg opacity-80 z-0" 
            />
          )}
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-4 border border-white/10 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-[#D41B2C]/10 text-[#D41B2C]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Avenues of Service Overview</h2>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Award className="w-8 h-8 opacity-50" />
                <p className="text-sm">No events logged yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Board of Directors Section */}
      {appSettings.showBoardOfDirectors && (
        <section className="space-y-8 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[#F7A81B] text-xs font-medium">
              <Globe className="w-3.5 h-3.5" />
              Leadership Council
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Board of Directors <span className="gold-gradient-text">2026-27</span></h2>
            <p className="text-slate-400 text-sm">Dedicated leaders driving action, innovation, and community impact.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {displayedBOD.slice(0, 3).map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="w-full sm:w-64 h-full"
              >
                <SpotlightCard className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#F7A81B]/50 transition-all group h-full">
                  <div className="h-48 overflow-hidden relative bg-slate-800">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Users className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-transparent to-transparent" />
                    {member.avenue && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-semibold text-[#F7A81B] border border-white/10 uppercase tracking-wider">
                        {member.avenue}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#F7A81B] transition-colors truncate" title={member.name}>{member.name}</h3>
                    <p className="text-xs text-slate-400 truncate">{member.role}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {showAllBOD && displayedBOD.length > 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {displayedBOD.slice(3).map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="h-full"
                >
                  <SpotlightCard className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-[#F7A81B]/50 transition-all group h-full">
                    <div className="h-48 overflow-hidden relative bg-slate-800">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Users className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-transparent to-transparent" />
                      {member.avenue && (
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-semibold text-[#F7A81B] border border-white/10 uppercase tracking-wider">
                          {member.avenue}
                        </span>
                      )}
                    </div>
                    <div className="p-5 space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#F7A81B] transition-colors truncate" title={member.name}>{member.name}</h3>
                      <p className="text-xs text-slate-400 truncate">{member.role}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          )}

          {!showAllBOD && displayedBOD.length > 3 && (
            <div className="flex justify-center mt-6 pt-2">
              <button 
                onClick={() => setShowAllBOD(true)}
                className="px-6 py-2.5 rounded-xl glass-panel border border-[#F7A81B]/30 text-[#F7A81B] font-bold text-sm hover:bg-[#F7A81B]/10 transition-colors cursor-pointer"
              >
                View all BOD's ({displayedBOD.length})
              </button>
            </div>
          )}
        </section>
      )}

      {/* Club Constitution Reader Modal (Mounted to body via Portal) */}
      {isConstitutionOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsConstitutionOpen(false)} />
          
          <div className="relative max-w-4xl w-full bg-[#0E131F] border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Official Club Constitution & Bylaws</h2>
                  <p className="text-xs text-slate-400">Rotaract Club of Acropolis Royals • RID 3040</p>
                </div>
              </div>
              <button 
                onClick={() => setIsConstitutionOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-[#D41B2C]" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-black/40 overflow-x-auto text-xs">
              {[
                { id: 'article1', label: 'Article I: Name & Objectives' },
                { id: 'article2', label: 'Article II: Membership Rules' },
                { id: 'article3', label: 'Article III: Board & Officers' },
                { id: 'article4', label: 'Article IV: Financial Ledger Rules' },
              ].map(art => (
                <button
                  key={art.id}
                  onClick={() => setActiveArticle(art.id as any)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeArticle === art.id 
                      ? 'bg-[#F7A81B] text-slate-950 shadow-md shadow-[#F7A81B]/20' 
                      : 'glass-panel text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {art.label}
                </button>
              ))}
            </div>

            {/* Article Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed flex-1">
              {activeArticle === 'article1' && (
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F7A81B]">Constitution & Bylaws</span>
                    <h3 className="text-xl font-black text-white">Article I — Name, Objectives & Foundational Purpose</h3>
                  </div>

                  <p><strong>Section 1. Official Name:</strong> The official name of this organization shall be the <strong>Rotaract Club of Acropolis Royals</strong> (chartered under Rotary International District 3040, Institutional Base: Acropolis Institute of Technology and Research, Indore).</p>

                  <p><strong>Section 2. Core Objectives:</strong> The primary objectives of this club shall be:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                    <li>To develop professional and leadership abilities through practical, student-driven organizational initiatives.</li>
                    <li>To emphasize respect for the rights of others, grounded in recognition of the worth of each individual.</li>
                    <li>To recognize the dignity and value of all useful occupations as opportunities to serve society.</li>
                    <li>To recognize, practice, and promote ethical standards as leadership qualities and vocational responsibilities.</li>
                    <li>To develop knowledge and understanding of the needs, problems, and opportunities in our local community and across the globe.</li>
                  </ul>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F7A81B] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-[#F7A81B]" /> The Rotary Four-Way Test (Guiding Principle)
                    </div>
                    <p className="text-xs text-slate-300 italic">Of the things we think, say or do:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-medium">
                        <span className="text-[#F7A81B] font-bold block">1. Truth</span>
                        Is it the TRUTH?
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-medium">
                        <span className="text-[#F7A81B] font-bold block">2. Fairness</span>
                        Is it FAIR to all concerned?
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-medium">
                        <span className="text-[#F7A81B] font-bold block">3. Goodwill</span>
                        Will it build GOODWILL and BETTER FRIENDSHIPS?
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-medium">
                        <span className="text-[#F7A81B] font-bold block">4. Beneficial</span>
                        Will it be BENEFICIAL to all concerned?
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeArticle === 'article2' && (
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Membership Charter</span>
                    <h3 className="text-xl font-black text-white">Article II — Membership Categories, Discipline & Code of Conduct</h3>
                  </div>

                  <p><strong>Section 1. Eligibility & Admission:</strong> Membership is extended to students of Acropolis Institute and dedicated young adults possessing sound character, leadership commitment, and academic good standing. Admission requires formal application, interaction with the Membership Committee, and ratification by the Board of Directors.</p>

                  <p><strong>Section 2. Active Membership Standards & Attendance:</strong></p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                    <li><strong>General Body Attendance:</strong> Members must maintain a minimum of <strong>60% attendance</strong> in all scheduled General Body Meetings per Rotary semester.</li>
                    <li><strong>Project Engagement:</strong> Every active member must serve on at least two avenues of service project teams per Rotary Year.</li>
                    <li><strong>Prompt Dues Settlement:</strong> Annual membership dues must be cleared within 30 days of induction or semester commencement.</li>
                  </ul>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <p className="font-bold text-white flex items-center gap-1.5 text-rose-400">
                      <Shield className="w-4 h-4 text-rose-400" /> Section 3. Institutional Discipline Index & Revocation
                    </p>
                    <p className="text-slate-300">
                      The club maintains an objective <strong>100-Point Member Discipline Metric</strong>. Deductions are levied for unexcused meeting absenteeism, conduct prejudicial to the club’s public standing, or violation of institutional campus regulations. Any member whose score drops below 60 points is placed on probationary review, and repeated infractions result in formal termination by a two-thirds vote of the Board of Directors.
                    </p>
                  </div>
                </div>
              )}

              {activeArticle === 'article3' && (
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Governance & Executive Hierarchy</span>
                    <h3 className="text-xl font-black text-white">Article III — Board of Directors, Officers & Executive Mandates</h3>
                  </div>

                  <p><strong>Section 1. Governing Body Structure:</strong> The governing body of the club shall be the Board of Directors, constituted of:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[#F7A81B] font-bold block">Executive Core Officers</span>
                      <p className="text-slate-300">• President (Chief Executive)</p>
                      <p className="text-slate-300">• Vice President (Executive Deputy)</p>
                      <p className="text-slate-300">• Club Secretary (Records & Protocol)</p>
                      <p className="text-slate-300">• Treasurer (Finance & Assets)</p>
                      <p className="text-slate-300">• Sergeant-at-Arms (Decorum & Quorum)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-emerald-400 font-bold block">Avenue Directors</span>
                      <p className="text-slate-300">• Director — Club Service</p>
                      <p className="text-slate-300">• Director — Community Service</p>
                      <p className="text-slate-300">• Director — Professional Development</p>
                      <p className="text-slate-300">• Director — International Service</p>
                      <p className="text-slate-300">• Director — Vocational Service</p>
                    </div>
                  </div>

                  <p><strong>Section 2. Key Officer Responsibilities:</strong></p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                    <li><strong>President:</strong> Presides at all club and board meetings, represents the club to Rotary District 3040, campus leadership, and guides club strategy.</li>
                    <li><strong>Secretary:</strong> Maintains official rosters, issues meeting notices, records minutes, and compiles district monthly reporting dossiers.</li>
                    <li><strong>Treasurer:</strong> Custodian of club funds, maintains financial registers, issues formal vouchers, and prepares quarterly balance audits.</li>
                  </ul>

                  <p><strong>Section 3. Tenure of Office:</strong> Officers and directors shall hold office for <strong>one Rotary Year</strong> (commencing July 1st and terminating June 30th). Core leadership transitions are conducted with verified handover documentation to maintain seamless institutional continuity.</p>
                </div>
              )}

              {activeArticle === 'article4' && (
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Fiscal Discipline & Audit</span>
                    <h3 className="text-xl font-black text-white">Article IV — Financial Ledger Rules & Membership Dues Apportionment</h3>
                  </div>

                  <p><strong>Section 1. Annual Membership Fee:</strong> The consolidated membership fee for each inducted member for the Rotary Year is formally fixed at <strong>₹1,200 (One Thousand Two Hundred Rupees Only)</strong>.</p>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Section 2. Statutory Apportionment & Fund Allocation Breakdown:
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">Rotary International Capitation Dues</span>
                          <span className="text-slate-400">Statutory global youth registration & charter levy</span>
                        </div>
                        <span className="text-[#F7A81B] font-mono font-bold">$5.00 USD + Applicable GST</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">District Council Administrative Assessment</span>
                          <span className="text-slate-400">District 3040 directory, awards fund & administrative contribution</span>
                        </div>
                        <span className="text-sky-400 font-mono font-bold">₹150.00 INR</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">Institutional Program & Service Operating Reserve</span>
                          <span className="text-slate-400">Subsidizes community drives, pins, kit materials & meeting overheads</span>
                        </div>
                        <span className="text-emerald-400 font-mono font-bold">Remaining Balance</span>
                      </div>
                    </div>
                  </div>

                  <p><strong>Section 3. Fiscal Transparency & Audit:</strong> No cash expenditure may be disbursed without formal dual authorization (President and Treasurer) accompanied by a verified physical or digital invoice. The complete ledger is permanently cataloged in the Rotaract OS Treasury Module and subject to bi-annual audit review.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <span className="text-xs text-slate-500">Acropolis Royals Institutional Memory Document</span>
              <button
                onClick={() => setIsConstitutionOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
