import React, { useState } from 'react';
import { UserCheck, Download, FileSpreadsheet, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';

interface AttendeeRow {
  serialNo: number;
  rotaractorName: string;
  yearAndSection: string;
  clubCoordinatorName: string;
  clubCoordinatorGmail: string;
}

const MOCK_ATTENDEES: AttendeeRow[] = [
  { serialNo: 1, rotaractorName: 'Rtr. Akshat Sharma', yearAndSection: '3rd Year CS-A', clubCoordinatorName: 'Dr. V. K. Jain', clubCoordinatorGmail: 'vkjain@acropolis.in' },
  { serialNo: 2, rotaractorName: 'Rtr. Priya Verma', yearAndSection: '3rd Year IT-B', clubCoordinatorName: 'Prof. S. R. Kulkarni', clubCoordinatorGmail: 'kulkarni@acropolis.in' },
  { serialNo: 3, rotaractorName: 'Rtr. Rohan Mehta', yearAndSection: '4th Year ME-A', clubCoordinatorName: 'Dr. V. K. Jain', clubCoordinatorGmail: 'vkjain@acropolis.in' },
  { serialNo: 4, rotaractorName: 'Rtr. Ananya Joshi', yearAndSection: '3rd Year EC-A', clubCoordinatorName: 'Prof. S. R. Kulkarni', clubCoordinatorGmail: 'kulkarni@acropolis.in' },
  { serialNo: 5, rotaractorName: 'Rtr. Devansh Saxena', yearAndSection: '2nd Year CS-B', clubCoordinatorName: 'Dr. V. K. Jain', clubCoordinatorGmail: 'vkjain@acropolis.in' },
];

export const AttendancePage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState('Blood Donation Camp 2026');
  const [eventDate] = useState('12 August 2026');
  const [eventTime] = useState('09:00 AM - 04:00 PM');

  const handleDownloadCSV = () => {
    const headers = "Serial Number,Rotaractor Name,Year & Section,Club Coordinator Name,Club Coordinator Gmail\n";
    const rows = MOCK_ATTENDEES.map(a => `${a.serialNo},"${a.rotaractorName}","${a.yearAndSection}","${a.clubCoordinatorName}","${a.clubCoordinatorGmail}"`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(`Event Name: ${selectedEvent}\nEvent Date: ${eventDate}\nEvent Time: ${eventTime}\n\n` + headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Advisor_Attendance_${selectedEvent.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Attendance & Faculty Advisor Export Studio</h1>
          <p className="text-sm text-slate-400">Live meeting check-ins and compliance reporting for college faculty/advisors.</p>
        </div>
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export 5-Column Advisor CSV Sheet
        </button>
      </div>

      {/* Required Faculty Advisor Report Card Container */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-[#F7A81B]/30 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F7A81B]/10 text-[#F7A81B] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Mandatory Faculty Report Format
            </div>
            <h2 className="text-2xl font-black text-white">{selectedEvent}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#F7A81B]" /> {eventDate}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#D41B2C]" /> {eventTime}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Verified Present</p>
              <p className="text-xl font-bold text-emerald-400">5 Rotaractors</p>
            </div>
          </div>
        </div>

        {/* 5-Column Table Display as mandated in MASTER_PROMPT §12 */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-white/5 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="p-3.5 w-16 text-center">Serial No</th>
                <th className="p-3.5">Rotaractor Name</th>
                <th className="p-3.5">Year & Section</th>
                <th className="p-3.5">Club Coordinator Name</th>
                <th className="p-3.5">Club Coordinator Gmail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {MOCK_ATTENDEES.map((row) => (
                <tr key={row.serialNo} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 text-center font-bold text-[#F7A81B]">{row.serialNo}</td>
                  <td className="p-3.5 font-sans font-semibold text-white">{row.rotaractorName}</td>
                  <td className="p-3.5 text-slate-300 font-sans">{row.yearAndSection}</td>
                  <td className="p-3.5 font-sans text-slate-300">{row.clubCoordinatorName}</td>
                  <td className="p-3.5 text-slate-400">{row.clubCoordinatorGmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
