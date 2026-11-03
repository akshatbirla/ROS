import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../app/AppContext';
import { CheckCircle, X, Image, Clock, Calendar, Users, Calculator } from 'lucide-react';

export const EventCompletionModal: React.FC = () => {
  const { events, updateEvent } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    actualDate: '',
    actualTime: '',
    actualDurationHours: 0,
    beneficiaries: 0,
    photo1: '',
    photo2: '',
    photo3: '',
    photo4: '',
    driveLink: '',
  });

  useEffect(() => {
    const handleOpen = (e: CustomEvent) => {
      const id = e.detail;
      const event = events.find(ev => ev.id === id);
      if (event) {
        setEventId(id);
        setFormData({
          actualDate: event.date,
          actualTime: event.startTime,
          actualDurationHours: 2,
          beneficiaries: 0,
          photo1: '',
          photo2: '',
          photo3: '',
          photo4: '',
          driveLink: '',
        });
        setIsOpen(true);
      }
    };
    window.addEventListener('open-completion-modal', handleOpen as EventListener);
    return () => window.removeEventListener('open-completion-modal', handleOpen as EventListener);
  }, [events]);

  if (!isOpen || !eventId) return null;

  const event = events.find(e => e.id === eventId);
  if (!event) return null;

  const totalRotaractors = (event.nominatedMemberIds || []).length;
  const manHours = totalRotaractors * formData.actualDurationHours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvent(eventId, {
      status: 'happened',
      actualDate: formData.actualDate,
      actualTime: formData.actualTime,
      actualDurationHours: formData.actualDurationHours,
      beneficiaries: formData.beneficiaries,
      photos: [formData.photo1, formData.photo2, formData.photo3, formData.photo4].filter(Boolean),
      driveLink: formData.driveLink,
    });
    setIsOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-[#0E131F] border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Complete Event
            </h2>
            <p className="text-xs text-slate-400 mt-1">Finalize actual execution details for <strong>{event.name}</strong></p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Actual Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input required type="text" value={formData.actualDate} onChange={e => setFormData({...formData, actualDate: e.target.value})} className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-emerald-500 text-sm text-white focus:outline-none" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Actual Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input required type="text" value={formData.actualTime} onChange={e => setFormData({...formData, actualTime: e.target.value})} className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-emerald-500 text-sm text-white focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Actual Duration (Hours)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input required type="number" min="0" step="0.5" value={formData.actualDurationHours} onChange={e => setFormData({...formData, actualDurationHours: parseFloat(e.target.value) || 0})} className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-emerald-500 text-sm text-white focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Number of Beneficiaries</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input required type="number" min="0" value={formData.beneficiaries} onChange={e => setFormData({...formData, beneficiaries: parseInt(e.target.value, 10) || 0})} className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-emerald-500 text-sm text-white focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Showcase Photo {num} URL {num > 2 && '(Optional)'}</label>
                <div className="relative">
                  <Image className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    required={num <= 2}
                    value={(formData as any)[`photo${num}`]} 
                    onChange={e => setFormData({...formData, [`photo${num}`]: e.target.value})} 
                    placeholder="https://..." 
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-emerald-500 text-sm text-white focus:outline-none" 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Google Drive Album Link (Optional)</label>
            <div className="relative">
              <Image className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={formData.driveLink} 
                onChange={e => setFormData({...formData, driveLink: e.target.value})} 
                placeholder="https://drive.google.com/..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-emerald-500 text-sm text-white focus:outline-none" 
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Impact Calculations
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Total Rotaractors Present:</span>
              <span className="font-bold text-white">{totalRotaractors}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Total Man Hours:</span>
              <span className="font-bold text-emerald-400">{manHours.toFixed(1)} Hours</span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10 gap-3">
            <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-xl text-white font-bold glass-panel border border-white/10 hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold flex items-center gap-2 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
