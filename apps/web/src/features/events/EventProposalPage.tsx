import React, { useState } from 'react';
import { useApp, RotaractEvent } from '../../app/AppContext';
import { Calendar, Clock, MapPin, FileText, CheckCircle, Trash2, Edit2, Users, Download, Plus, LayoutList, CheckSquare, ChevronDown, Search, X, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';

export const getAvenueColor = (avenue: string) => {
  switch (avenue) {
    case 'Club Service': return 'text-[#F7A81B] bg-[#F7A81B]/15 border-[#F7A81B]/30';
    case 'Community Service': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'Vocational Service': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    case 'International Service': return 'text-[#D41B2C] bg-[#D41B2C]/10 border-[#D41B2C]/20';
    case 'Professional Dev': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
    default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  }
};

export const EventProposalPage: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, activeMembers } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAvenueOpen, setIsAvenueOpen] = useState(false);
  const [isPublicStatusOpen, setIsPublicStatusOpen] = useState(false);
  
  const [detailsEventId, setDetailsEventId] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const avenues = ["Club Service", "Community Service", "Vocational Service", "International Service", "Professional Dev"];
  
  const [formData, setFormData] = useState({
    name: '',
    lead: '',
    avenue: 'Club Service',
    date: '',
    venue: '',
    about: '',
    posterUrl: '',
    formLink: '',
    publicStatus: 'Upcoming' as 'Upcoming' | 'Ongoing' | 'Completed',
    isPublic: false,
  });

  const [timeState, setTimeState] = useState({
    startHr: '10', startMin: '00', startAmPm: 'AM',
    endHr: '12', endMin: '00', endAmPm: 'PM'
  });

  const pendingApprovalEvents = events.filter(e => e.status === 'pending_approval');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const happenedEvents = events.filter(e => e.status === 'happened');

  const openNewProposalModal = () => {
    setIsEditing(null);
    setFormData({ name: '', lead: '', avenue: 'Club Service', date: '', venue: '', about: '', posterUrl: '', formLink: '', publicStatus: 'Upcoming', isPublic: false });
    setTimeState({ startHr: '10', startMin: '00', startAmPm: 'AM', endHr: '12', endMin: '00', endAmPm: 'PM' });
    setIsModalOpen(true);
  };

  const parseTimeParts = (fullTime: string) => {
    try {
      const isPM = fullTime.toUpperCase().includes('PM');
      const text = fullTime.replace(/AM|PM/i, '').trim();
      const parts = text.split(':');
      const hr = parts[0] || '12';
      const min = parts[1] || '00';
      return { hr: hr.padStart(2, '0'), min: min.padStart(2, '0'), amPm: isPM ? 'PM' : 'AM' };
    } catch (e) {
      return { hr: '12', min: '00', amPm: 'AM' };
    }
  };

  const handleEdit = (event: RotaractEvent) => {
    setIsEditing(event.id);
    setFormData({
      name: event.name,
      lead: event.lead || '',
      avenue: event.avenue || 'Club Service',
      date: event.date,
      venue: event.venue,
      about: event.about,
      posterUrl: event.posterUrl || '',
      formLink: event.formLink || '',
      publicStatus: event.publicStatus || 'Upcoming',
      isPublic: event.isPublic || false,
    });
    const parsedStart = parseTimeParts(event.startTime);
    const parsedEnd = parseTimeParts(event.endTime);
    setTimeState({
      startHr: parsedStart.hr, startMin: parsedStart.min, startAmPm: parsedStart.amPm,
      endHr: parsedEnd.hr, endMin: parsedEnd.min, endAmPm: parsedEnd.amPm
    });
    setDetailsEventId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Time Validation
    let startHrNum = parseInt(timeState.startHr || '12', 10);
    if (startHrNum === 12) startHrNum = timeState.startAmPm === 'AM' ? 0 : 12;
    else if (timeState.startAmPm === 'PM') startHrNum += 12;

    let endHrNum = parseInt(timeState.endHr || '12', 10);
    if (endHrNum === 12) endHrNum = timeState.endAmPm === 'AM' ? 0 : 12;
    else if (timeState.endAmPm === 'PM') endHrNum += 12;

    const startTotalMins = (startHrNum * 60) + parseInt(timeState.startMin || '0', 10);
    const endTotalMins = (endHrNum * 60) + parseInt(timeState.endMin || '0', 10);

    if (endTotalMins <= startTotalMins) {
      alert("End time must be after the start time.");
      return;
    }

    const finalStart = `${String(parseInt(timeState.startHr || '12', 10)).padStart(2, '0')}:${String(parseInt(timeState.startMin || '0', 10)).padStart(2, '0')} ${timeState.startAmPm}`;
    const finalEnd = `${String(parseInt(timeState.endHr || '12', 10)).padStart(2, '0')}:${String(parseInt(timeState.endMin || '0', 10)).padStart(2, '0')} ${timeState.endAmPm}`;
    
    const finalData = {
      ...formData,
      startTime: finalStart,
      endTime: finalEnd
    };

    if (isEditing) {
      updateEvent(isEditing, finalData);
    } else {
      addEvent(finalData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setEventToDelete(id);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete);
      if (detailsEventId === eventToDelete) setDetailsEventId(null);
      setEventToDelete(null);
    }
  };

  const toggleNomination = (eventId: string, memberId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const currentNominees = event.nominatedMemberIds || [];
    const updatedNominees = currentNominees.includes(memberId)
      ? currentNominees.filter(id => id !== memberId)
      : [...currentNominees, memberId];

    updateEvent(eventId, { nominatedMemberIds: updatedNominees });
  };

  const exportAttendanceExcel = (event: RotaractEvent) => {
    const nominees = activeMembers.filter(m => event.nominatedMemberIds?.includes(m.id));
    
    const wsData: any[][] = [
      ["Rotaract Club of Acropolis Royals"],
      [],
      ["Event Name", event.name],
      ["Event Date", event.date],
      ["Start Time", event.startTime],
      ["End Time", event.endTime],
      ["Event Venue", event.venue],
      [],
      ["Serial Number", "Rotaractor Name", "Year", "Section", "Class Coordinator", "Class Coordinator Email"],
    ];

    nominees.forEach((nominee, idx) => {
      wsData.push([
        idx + 1,
        nominee.name,
        nominee.currentYear || "N/A",
        nominee.section || "N/A",
        "N/A", 
        "N/A", 
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `${event.name.replace(/\s+/g, '_')}_Attendance.xlsx`);
  };

  const renderCompactCard = (event: RotaractEvent) => (
    <div 
      key={event.id} 
      onClick={() => setDetailsEventId(event.id)} 
      className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#F7A81B]/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col gap-2 shadow-lg hover:shadow-2xl"
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getAvenueColor(event.avenue || '')}`}>
          {event.avenue}
        </span>
        {event.isPublic && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${event.publicStatus === 'Ongoing' ? 'bg-[#F7A81B] text-slate-950' : event.publicStatus === 'Upcoming' ? 'bg-sky-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {event.publicStatus}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-white leading-tight truncate" title={event.name}>{event.name}</h3>
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Calendar className="w-3 h-3" /> 
        {event.date}
      </div>
    </div>
  );

  const renderHappenedCard = (event: RotaractEvent) => (
    <div key={event.id} className="glass-panel p-3 rounded-2xl border border-white/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex justify-between items-center gap-3">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`self-start px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getAvenueColor(event.avenue || '')}`}>
            {event.avenue}
          </span>
          {event.isPublic && (
            <span className={`self-start px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${event.publicStatus === 'Ongoing' ? 'bg-[#F7A81B] text-slate-950' : event.publicStatus === 'Upcoming' ? 'bg-sky-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {event.publicStatus}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-white truncate" title={event.name}>{event.name}</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Calendar className="w-3 h-3" /> {event.date}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 shrink-0 bg-black/20 p-1 rounded-xl border border-white/5">
        <button onClick={() => handleEdit(event)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Edit Event">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => handleDelete(event.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors" title="Delete Event">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  const activeDetailsEvent = detailsEventId ? events.find(e => e.id === detailsEventId) : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#F7A81B]" />
            Events Manager
          </h1>
          <p className="text-sm text-slate-400 mt-2">Manage event proposals through pending, approved, and happened states.</p>
        </div>
        <button 
          onClick={openNewProposalModal}
          className="px-6 py-3 bg-[#F7A81B] text-black font-bold rounded-xl hover:opacity-90 flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-[#F7A81B]/20"
        >
          <Plus className="w-5 h-5" />
          Create New Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2 sticky top-0 bg-[#080B11] z-10 py-2 border-b border-white/10">
            <LayoutList className="w-5 h-5" />
            Pending Approval ({pendingApprovalEvents.length})
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 pb-10">
            {pendingApprovalEvents.length === 0 ? (
              <div className="text-center p-6 glass-panel rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm">No pending proposals.</p>
              </div>
            ) : (
              pendingApprovalEvents.map(event => renderCompactCard(event))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-sky-400 flex items-center gap-2 sticky top-0 bg-[#080B11] z-10 py-2 border-b border-sky-400/20">
            <CheckSquare className="w-5 h-5" />
            Approved Events ({approvedEvents.length})
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 pb-10">
            {approvedEvents.length === 0 ? (
              <div className="text-center p-6 glass-panel rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm">No approved events in the pipeline.</p>
              </div>
            ) : (
              approvedEvents.map(event => renderCompactCard(event))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-white/10">
        <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 pb-2">
          <CheckCircle className="w-5 h-5" />
          Happened Events ({happenedEvents.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {happenedEvents.length === 0 ? (
             <div className="text-center p-6 glass-panel rounded-2xl border border-white/5 sm:col-span-2 md:col-span-3 lg:col-span-4">
               <p className="text-slate-400 text-sm">No happened events yet. Mark an approved event as happened.</p>
             </div>
          ) : (
            happenedEvents.map(event => renderHappenedCard(event))
          )}
        </div>
      </div>

      <AnimatePresence>
        {activeDetailsEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDetailsEventId(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-[#0E131F] border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-white/10 flex flex-col gap-3 bg-white/5">
                <div className="flex items-start justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getAvenueColor(activeDetailsEvent.avenue || '')}`}>
                    {activeDetailsEvent.avenue}
                  </span>
                  <button onClick={() => setDetailsEventId(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-white">{activeDetailsEvent.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#F7A81B]" /> {activeDetailsEvent.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-sky-400" /> {activeDetailsEvent.startTime} - {activeDetailsEvent.endTime}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {activeDetailsEvent.venue}</span>
                </div>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">About the Event</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{activeDetailsEvent.about}</p>
                </div>

                {activeDetailsEvent.status === 'approved' && (
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#38BDF8]" />
                        Rotaractor Nominations ({(activeDetailsEvent.nominatedMemberIds || []).length})
                      </h4>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-48">
                          <Search className="absolute left-3 top-1.5 w-3.5 h-3.5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                          />
                        </div>
                        <button onClick={() => exportAttendanceExcel(activeDetailsEvent)} className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1.5 transition-colors shrink-0">
                          <Download className="w-3.5 h-3.5" />
                          Export
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {activeMembers.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map(member => (
                        <label key={member.id} className="flex items-center gap-3 p-2 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 cursor-pointer transition-all">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-white/10 bg-black accent-[#F7A81B]"
                            checked={(activeDetailsEvent.nominatedMemberIds || []).includes(member.id)}
                            onChange={() => toggleNomination(activeDetailsEvent.id, member.id)}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-white truncate w-full">{member.name}</span>
                            <span className="text-[10px] text-slate-500 truncate w-full">{member.designation || 'Member'}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 flex flex-wrap justify-between gap-3 bg-black/20">
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(activeDetailsEvent)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-2 transition-all">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(activeDetailsEvent.id)} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs flex items-center gap-2 transition-all">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
                
                {activeDetailsEvent.status === 'pending_approval' && (
                  <button 
                    onClick={() => { updateEvent(activeDetailsEvent.id, { status: 'approved' }); setDetailsEventId(null); }} 
                    className="px-5 py-2 rounded-xl bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 font-bold text-sm flex items-center gap-2 transition-all border border-sky-500/30"
                  >
                    <CheckSquare className="w-4 h-4" /> Approve Event
                  </button>
                )}

                {activeDetailsEvent.status === 'approved' && (
                  <button 
                    onClick={() => { setDetailsEventId(null); window.dispatchEvent(new CustomEvent('open-completion-modal', { detail: activeDetailsEvent.id })); }} 
                    className="px-5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold text-sm flex items-center gap-2 transition-all border border-emerald-500/30"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark Happened
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-[#0E131F] border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Proposal' : 'Create New Proposal'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form id="proposal-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Event Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm" />
                    </div>
                    
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Event Lead</label>
                      <input type="text" value={formData.lead} onChange={e => setFormData({...formData, lead: e.target.value})} placeholder="e.g. Rtr. John Doe" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Avenue</label>
                      <div className="relative">
                        <div 
                          onClick={() => setIsAvenueOpen(!isAvenueOpen)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] text-white text-sm cursor-pointer flex justify-between items-center"
                        >
                          {formData.avenue}
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isAvenueOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {isAvenueOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#0B101A]/95 backdrop-blur-xl border border-white/10 z-50 shadow-2xl flex flex-col gap-1 max-h-48 overflow-y-auto">
                            {avenues.map(av => (
                              <div 
                                key={av} 
                                onClick={() => { setFormData({...formData, avenue: av}); setIsAvenueOpen(false); }}
                                className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${formData.avenue === av ? 'bg-[#F7A81B]/20 text-[#F7A81B] font-bold' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                              >
                                {av}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Public Display & Status</label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <div 
                            onClick={() => setIsPublicStatusOpen(!isPublicStatusOpen)}
                            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] text-white text-sm cursor-pointer flex justify-between items-center"
                          >
                            {formData.publicStatus}
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isPublicStatusOpen ? 'rotate-180' : ''}`} />
                          </div>
                          {isPublicStatusOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#0B101A]/95 backdrop-blur-xl border border-white/10 z-50 shadow-2xl flex flex-col gap-1 max-h-48 overflow-y-auto">
                              {['Upcoming', 'Ongoing', 'Completed'].map(status => (
                                <div 
                                  key={status} 
                                  onClick={() => { setFormData({...formData, publicStatus: status as any}); setIsPublicStatusOpen(false); }}
                                  className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${formData.publicStatus === status ? 'bg-[#F7A81B]/20 text-[#F7A81B] font-bold' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                                >
                                  {status}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/10 shrink-0 h-[42px]">
                          <span className="text-[10px] text-slate-400 font-bold uppercase text-right leading-tight max-w-[80px]">Public Display</span>
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${formData.isPublic ? 'bg-emerald-500' : 'bg-slate-700'}`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${formData.isPublic ? 'translate-x-4' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                      <input required type="date" min="2026-07-01" max="2027-06-30" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm [color-scheme:dark]" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Start Time (12H Clock)</label>
                      <div className="flex gap-2">
                        <input required type="number" min="1" max="12" placeholder="HH" value={timeState.startHr} onChange={e => setTimeState({...timeState, startHr: e.target.value})} className="flex-1 px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm text-center" />
                        <span className="text-slate-400 self-center font-bold">:</span>
                        <input required type="number" min="0" max="59" placeholder="MM" value={timeState.startMin} onChange={e => setTimeState({...timeState, startMin: e.target.value})} className="flex-1 px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm text-center" />
                        <div className="flex rounded-xl overflow-hidden border border-white/10 bg-black/40 p-0.5 shrink-0">
                          <button type="button" onClick={() => setTimeState({...timeState, startAmPm: 'AM'})} className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors ${timeState.startAmPm === 'AM' ? 'bg-[#F7A81B] text-black' : 'text-slate-400 hover:text-white'}`}>AM</button>
                          <button type="button" onClick={() => setTimeState({...timeState, startAmPm: 'PM'})} className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors ${timeState.startAmPm === 'PM' ? 'bg-[#F7A81B] text-black' : 'text-slate-400 hover:text-white'}`}>PM</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">End Time (12H Clock)</label>
                      <div className="flex gap-2">
                        <input required type="number" min="1" max="12" placeholder="HH" value={timeState.endHr} onChange={e => setTimeState({...timeState, endHr: e.target.value})} className="flex-1 px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm text-center" />
                        <span className="text-slate-400 self-center font-bold">:</span>
                        <input required type="number" min="0" max="59" placeholder="MM" value={timeState.endMin} onChange={e => setTimeState({...timeState, endMin: e.target.value})} className="flex-1 px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm text-center" />
                        <div className="flex rounded-xl overflow-hidden border border-white/10 bg-black/40 p-0.5 shrink-0">
                          <button type="button" onClick={() => setTimeState({...timeState, endAmPm: 'AM'})} className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors ${timeState.endAmPm === 'AM' ? 'bg-[#F7A81B] text-black' : 'text-slate-400 hover:text-white'}`}>AM</button>
                          <button type="button" onClick={() => setTimeState({...timeState, endAmPm: 'PM'})} className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-colors ${timeState.endAmPm === 'PM' ? 'bg-[#F7A81B] text-black' : 'text-slate-400 hover:text-white'}`}>PM</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Venue</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input required type="text" placeholder="e.g. Central Auditorium" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Poster URL (Optional)</label>
                      <input type="text" placeholder="https://..." value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Google Form Link (Optional)</label>
                      <input type="text" placeholder="https://forms.gle/..." value={formData.formLink} onChange={e => setFormData({...formData, formLink: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">About the Event</label>
                    <textarea required rows={4} value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#F7A81B] focus:outline-none text-white text-sm" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 glass-panel text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10">
                  Cancel
                </button>
                <button type="submit" form="proposal-form" className="px-6 py-2.5 bg-[#F7A81B] text-black font-bold rounded-xl hover:opacity-90 flex items-center gap-2 transition-all">
                  {isEditing ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isEditing ? 'Save Changes' : 'Submit Proposal'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setEventToDelete(null)} />
          <div className="relative max-w-md w-full bg-[#0E131F] border border-rose-500/30 rounded-3xl p-6 z-10 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Confirm Event Deletion</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">{events.find(e => e.id === eventToDelete)?.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <Trash2 className="w-4 h-4" />
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
