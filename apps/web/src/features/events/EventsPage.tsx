import React, { useState } from 'react';
import { useApp, RotaractEvent } from '../../app/AppContext';
import { Calendar, Clock, MapPin, Users, Activity, ArrowLeft, Image as ImageIcon, Printer } from 'lucide-react';
import { getAvenueColor } from './EventProposalPage';
export const EventsPage: React.FC = () => {
  const { events } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Filter completed events and sort chronologically by date
  const completedEvents = events
    .filter(e => e.status === 'happened')
    .sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      return dateA.localeCompare(dateB);
    });

  if (selectedEventId) {
    const event = events.find(e => e.id === selectedEventId);
    if (event) {
      return <EventDetailsView event={event} onBack={() => setSelectedEventId(null)} />;
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#F7A81B]" />
          Events
        </h1>
        <p className="text-sm text-slate-400 mt-2">Archive of all successfully executed projects and events.</p>
      </div>

      {completedEvents.length === 0 ? (
        <div className="text-center p-12 glass-panel rounded-3xl border border-white/10">
          <p className="text-slate-400">No completed events yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedEvents.map((evt) => {
            const rotaractorsCount = (evt.nominatedMemberIds || []).length;
            const manHours = rotaractorsCount * (evt.actualDurationHours || 0);

            return (
              <div key={evt.id} className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-[#F7A81B]/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 space-y-5 flex flex-col justify-between cursor-pointer" onClick={() => setSelectedEventId(evt.id)}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getAvenueColor(evt.avenue || '')}`}>
                      {evt.avenue}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white leading-snug">{evt.name}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{evt.about}</p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#F7A81B]" />
                    {evt.date} • {evt.startTime} - {evt.endTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D41B2C]" />
                    {evt.venue}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {evt.beneficiaries} Beneficiaries</span>
                    <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {manHours.toFixed(1)} Man Hours</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const EventDetailsView: React.FC<{ event: RotaractEvent, onBack: () => void }> = ({ event, onBack }) => {
  const rotaractorsCount = (event.nominatedMemberIds || []).length;
  const manHours = rotaractorsCount * (event.actualDurationHours || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:bg-white print:text-black">
      {/* Navigation & Actions (Hidden on Print) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>
        <button onClick={handlePrint} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
          <Printer className="w-4 h-4" />
          Export to PDF
        </button>
      </div>

      {/* Report Header for Print */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black uppercase">Rotaract Club of Acropolis Royals</h1>
        <p className="text-sm font-semibold">Official Event Report</p>
      </div>

      {/* Event Overview */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 print:border-black print:rounded-none print:shadow-none space-y-6">
        <div>
          {event.avenue && (
            <div className="flex items-center gap-2 mb-3 print:hidden">
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getAvenueColor(event.avenue)}`}>
                {event.avenue}
              </span>
            </div>
          )}
          <h1 className="text-3xl font-extrabold text-[#F7A81B] print:text-black">{event.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm mt-4 text-slate-300 print:text-black">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {event.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {event.startTime} - {event.endTime} ({event.actualDurationHours} hrs)</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.venue}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 print:border-black">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 print:border-black print:bg-transparent text-center space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 print:text-black">Beneficiaries</p>
            <p className="text-2xl font-black text-white print:text-black">{event.beneficiaries || 0}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 print:border-black print:bg-transparent text-center space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 print:text-black">Rotaractors</p>
            <p className="text-2xl font-black text-white print:text-black">{rotaractorsCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 print:border-black print:bg-transparent text-center space-y-1 md:col-span-2">
            <p className="text-[10px] uppercase font-bold text-emerald-400 print:text-black">Total Man Hours Generated</p>
            <p className="text-2xl font-black text-emerald-400 print:text-black">{manHours.toFixed(1)}</p>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <h3 className="text-lg font-bold text-white print:text-black">About the Event</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap print:text-black">{event.about}</p>
        </div>
      </div>

      {/* Event Glimpses */}
      {event.photos && event.photos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white print:text-black flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#38BDF8] print:text-black" />
            Event Glimpses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.photos.map((photoUrl, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 print:border-none print:mb-4 bg-black/40">
                <img 
                  src={photoUrl} 
                  alt={`Glimpse ${idx + 1}`} 
                  className="w-full h-auto object-contain max-h-96"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
