import React, { useState, useRef } from 'react';
import { useApp } from '../../app/AppContext';
import { Award, FileText, UploadCloud, Eye, Download, FileCheck2, Calendar } from 'lucide-react';

const ROTARY_MONTHS = [
  'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026',
  'Jan 2027', 'Feb 2027', 'Mar 2027', 'Apr 2027', 'May 2027', 'Jun 2027'
];

export const ReportsPage: React.FC = () => {
  const { events, eventReports, monthlyReports, uploadEventReport, uploadMonthlyReport } = useApp();
  const [activeTab, setActiveTab] = useState<'events' | 'monthly'>('events');

  // Filter completed events
  const completedEvents = events
    .filter(e => e.status === 'happened')
    .sort((a, b) => (a.actualDate || '').localeCompare(b.actualDate || ''));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Award className="w-8 h-8 text-[#F7A81B]" />
          Club Reports & Documentation
        </h1>
        <p className="text-sm text-slate-400 mt-2">Manage official PDFs for completed events and monthly district submissions.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-5 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            activeTab === 'events' ? 'bg-[#F7A81B] text-black shadow-lg shadow-[#F7A81B]/20' : 'glass-panel text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileText className="w-4 h-4" />
          Event Reports
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-5 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${
            activeTab === 'monthly' ? 'bg-[#F7A81B] text-black shadow-lg shadow-[#F7A81B]/20' : 'glass-panel text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Monthly Reports
        </button>
      </div>

      {/* Content */}
      <div className="pt-2">
        {activeTab === 'events' && (
          <div className="space-y-6">
            {completedEvents.length === 0 ? (
              <div className="text-center p-12 glass-panel rounded-3xl border border-white/10">
                <p className="text-slate-400">No completed events available to report on.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {completedEvents.map(event => {
                  const existingReport = eventReports.find(r => r.eventId === event.id);
                  return (
                    <ReportCard
                      key={event.id}
                      title={event.name}
                      subtitle={`Completed: ${event.actualDate}`}
                      hasReport={!!existingReport}
                      onUpload={(dataUrl) => uploadEventReport(event.id, dataUrl)}
                      pdfDataUrl={existingReport?.pdfDataUrl}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROTARY_MONTHS.map(month => {
              const existingReport = monthlyReports.find(r => r.monthKey === month);
              return (
                <ReportCard
                  key={month}
                  title={`${month} Report`}
                  subtitle="Official Monthly District Submission"
                  hasReport={!!existingReport}
                  onUpload={(dataUrl) => uploadMonthlyReport(month, dataUrl)}
                  pdfDataUrl={existingReport?.pdfDataUrl}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable card for both Event and Monthly reports
interface ReportCardProps {
  title: string;
  subtitle: string;
  hasReport: boolean;
  onUpload: (dataUrl: string) => void;
  pdfDataUrl?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, subtitle, hasReport, onUpload, pdfDataUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          onUpload(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (pdfDataUrl) {
      const a = document.createElement('a');
      a.href = pdfDataUrl;
      a.download = `${title.replace(/\s+/g, '_')}_Report.pdf`;
      a.click();
    }
  };

  const handleView = () => {
    if (pdfDataUrl) {
      // Create an iframe to view the base64 pdf in a new window/tab
      const win = window.open();
      if (win) {
        win.document.write(`<iframe src="${pdfDataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          {hasReport ? (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <FileCheck2 className="w-3 h-3" /> Uploaded
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/5 text-slate-400 border border-white/10">
              Pending Upload
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
        <input 
          type="file" 
          accept="application/pdf" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        {hasReport ? (
          <>
            <button onClick={handleView} className="p-2 rounded-xl glass-panel text-white border border-white/10 hover:bg-white/10 transition-colors flex justify-center items-center gap-1.5 text-xs font-semibold">
              <Eye className="w-4 h-4 text-[#38BDF8]" /> View
            </button>
            <button onClick={handleDownload} className="p-2 rounded-xl glass-panel text-white border border-white/10 hover:bg-white/10 transition-colors flex justify-center items-center gap-1.5 text-xs font-semibold">
              <Download className="w-4 h-4 text-emerald-400" /> Download
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="col-span-2 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:border-white/10 transition-colors flex justify-center items-center gap-1.5 text-xs font-semibold">
              <UploadCloud className="w-4 h-4" /> Replace PDF
            </button>
          </>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} className="col-span-2 p-3 rounded-xl bg-[#F7A81B]/10 text-[#F7A81B] border border-[#F7A81B]/30 hover:bg-[#F7A81B]/20 transition-colors flex justify-center items-center gap-2 text-sm font-bold">
            <UploadCloud className="w-4 h-4" /> Upload PDF Report
          </button>
        )}
      </div>
    </div>
  );
};
