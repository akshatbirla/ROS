import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, MapPin, Clock, Heart, Share2, Info, ExternalLink, X } from 'lucide-react';
import { useApp, RotaractEvent } from '../../app/AppContext';

export const getAvenueColor = (avenue: string) => {
  switch (avenue) {
    case 'Club Service': return 'text-[#F7A81B] bg-[#F7A81B]/15 border-[#F7A81B]/30 shadow-[#F7A81B]/20';
    case 'Community Service': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20';
    case 'Vocational Service': return 'text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-sky-500/20';
    case 'International Service': return 'text-[#D41B2C] bg-[#D41B2C]/10 border-[#D41B2C]/20 shadow-[#D41B2C]/20';
    case 'Professional Dev': return 'text-violet-400 bg-violet-500/10 border-violet-500/20 shadow-violet-500/20';
    default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20 shadow-slate-500/20';
  }
};

export const PublicEventsPage: React.FC = () => {
  const { events } = useApp();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<RotaractEvent | null>(null);

  // Filter only events that are marked as public and are not pending
  const publicEvents = events.filter(e => {
    if (!e.isPublic || e.status === 'pending_approval') return false;
    if (filter !== 'All' && e.avenue !== filter) return false;
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 pt-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Events & <span className="text-pink-400">Projects</span></h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Discover our ongoing and upcoming projects and become a part of the change. 
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl glass-panel border border-white/10 text-sm text-white focus:outline-none focus:border-pink-500/50 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
        {['All', 'Club Service', 'Community Service', 'Vocational Service', 'International Service', 'Professional Dev'].map(cat => {
          const isActive = filter === cat;
          const colors = cat === 'All' 
            ? 'text-white bg-white/20 border-white/30 shadow-white/20' 
            : getAvenueColor(cat);
            
          return (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive 
                  ? `${colors} shadow-lg` 
                  : 'glass-panel text-slate-300 hover:bg-white/10 border-white/10'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Dynamic Events Grid */}
      {publicEvents.length === 0 ? (
        <div className="text-center p-12 glass-panel rounded-3xl border border-white/10">
          <p className="text-slate-400">No public events currently match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicEvents.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-pink-500/10 hover:border-pink-500/30 transition-all flex flex-col group"
            >
              <div className="h-56 relative overflow-hidden bg-[#080B11]">
                <img 
                  src={event.posterUrl || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80"} 
                  alt={event.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] to-transparent opacity-80" />
                
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${getAvenueColor(event.avenue)}`}>
                    {event.avenue}
                  </span>
                </div>
                
                <div className="absolute top-4 right-4">
                  {event.publicStatus === 'Ongoing' ? (
                    <span className="px-3 py-1 rounded-full bg-[#F7A81B] text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Register Now
                    </span>
                  ) : event.publicStatus === 'Upcoming' ? (
                    <span className="px-3 py-1 rounded-full bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Upcoming
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Completed
                    </span>
                  )}
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-pink-500 transition-colors cursor-pointer drop-shadow-md"><Heart className="w-4 h-4 fill-current" /><span className="text-xs font-bold">{event.likes || 0}</span></button>
                    <button className="flex items-center gap-1.5 text-white/80 hover:text-emerald-500 transition-colors cursor-pointer drop-shadow-md"><Share2 className="w-4 h-4" /><span className="text-xs font-bold">{event.shares || 0}</span></button>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight mb-3 line-clamp-1">{event.name}</h3>
                  <div className="space-y-2 mb-2">
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <div className="p-1 rounded-md bg-white/5 text-slate-400"><Calendar className="w-3.5 h-3.5" /></div>
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <div className="p-1 rounded-md bg-white/5 text-slate-400"><Clock className="w-3.5 h-3.5" /></div>
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      <div className="p-1 rounded-md bg-white/5 text-slate-400"><MapPin className="w-3.5 h-3.5" /></div>
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all flex-1 justify-center border border-white/5"
                  >
                    <Info className="w-3.5 h-3.5" /> More Info
                  </button>

                  {event.publicStatus === 'Ongoing' ? (
                    <a 
                      href={event.formLink || '#'} 
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#F7A81B] text-black font-bold text-xs hover:opacity-90 flex items-center gap-2 transition-all flex-1 justify-center shadow-lg shadow-[#F7A81B]/20"
                    >
                      Click to Join <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : event.publicStatus === 'Upcoming' ? (
                    <button className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-400 flex items-center gap-2 transition-all flex-1 justify-center shadow-lg shadow-sky-500/20">
                      <Clock className="w-3.5 h-3.5" /> Remind Me
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* More Info Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setSelectedEvent(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-2xl w-full bg-[#0E131F] border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
                <img 
                  src={selectedEvent.posterUrl || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80"} 
                  alt={selectedEvent.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E131F] via-[#0E131F]/40 to-transparent" />
                <button 
                  onClick={() => setSelectedEvent(null)} 
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 -mt-16 relative z-10 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                <div>
                  <span className={`inline-block px-3 py-1 mb-3 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${getAvenueColor(selectedEvent.avenue)}`}>
                    {selectedEvent.avenue}
                  </span>
                  <h2 className="text-3xl font-extrabold text-white leading-tight">{selectedEvent.name}</h2>
                </div>

                <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 text-sm text-slate-200">
                    <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400"><Calendar className="w-4 h-4" /></div>
                    <span className="font-semibold">{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-200">
                    <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400"><Clock className="w-4 h-4" /></div>
                    <span className="font-semibold">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-200">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400"><MapPin className="w-4 h-4" /></div>
                    <span className="font-semibold">{selectedEvent.venue}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-pink-400" />
                    About this Initiative
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 p-5 rounded-2xl border border-white/5">
                    {selectedEvent.about}
                  </p>
                </div>
                
                {selectedEvent.publicStatus === 'Ongoing' && (
                  <div className="pt-4 mt-auto">
                    <a 
                      href={selectedEvent.formLink || '#'} 
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-xl bg-[#F7A81B] text-black font-bold hover:opacity-90 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#F7A81B]/20"
                    >
                      Join Event <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
