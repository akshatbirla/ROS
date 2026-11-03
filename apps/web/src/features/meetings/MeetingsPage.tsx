import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Calendar, Clock, Users, CheckCircle2, Circle, ChevronDown, ChevronUp, 
  Download, Plus, Search, MapPin, Video, FileText, Check, AlertCircle, 
  ExternalLink, Sparkles, Filter, X, Edit3, Eye, Shield, UserCheck
} from 'lucide-react';
import { useApp } from '../../app/AppContext';

export interface MeetingItem {
  id: string;
  title: string;
  type: 'GBM' | 'GM'; // General Board Meeting vs General Meeting
  calledBy: string; 
  agenda: string;
  agendaItems: string[];
  format: 'Offline' | 'Virtual';
  venueOrLink?: string; // Optional Room / Google Meet URL
  date: string; // YYYY-MM-DD
  time: string;
  status: 'Scheduled' | 'Completed';
  attendeesCount: number;
  attendedMemberNames?: string[];
  momText?: string; // Minutes of Meeting copy-paste / formatted text
  momFiledAt?: string;
  momFiledBy?: string;
}

const AUTHORIZED_CALLERS = [
  'President',
  'Secretary',
  'Sergeant-at-Arms',
  'Vice President',
  'Joint Secretary',
  'Treasurer',
  'Club Learning Facilitator',
  'Club Student Advisor',
  'Faculty Student Advisor'
];

const INITIAL_MEETINGS: MeetingItem[] = [
  {
    id: 'MTG-2026-004',
    title: 'General Board Meeting #04',
    type: 'GBM',
    calledBy: 'President',
    agenda: 'Quarterly avenue performance review, budget distribution for District Assembly, and review of upcoming flagship campaigns.',
    agendaItems: [
      'Call to Order by President & 4-Way Test Recitation',
      'Avenue Directors Q1 Activity & Impact Presentations',
      'Finance & Ledger Audit: Member dues collected & Rotary International dues remittance',
      'Flagship project review: Paws and Claws & Reader’s Round Table expansion',
      'Any Other Business (AOB) & Adjournment by Secretary'
    ],
    format: 'Offline',
    venueOrLink: 'Conference Room 3B, Acropolis Central Campus',
    date: '2026-08-28',
    time: '05:30 PM',
    status: 'Scheduled',
    attendeesCount: 0,
    attendedMemberNames: [],
    momText: '',
  },
  {
    id: 'MTG-2026-003',
    title: 'General Meeting #03 – Fellowship & Project Ideathon',
    type: 'GM',
    calledBy: 'Secretary',
    agenda: 'All-members general assembly to pitch new community service ideas, award Star Rotaractor of the Month, and brief on upcoming college induction.',
    agendaItems: [
      'Welcome Address by Secretary',
      'Member Idea Pitches: 3-minute open stage',
      'Announcement of Mega Blood Donation Camp dates',
      'Fellowship fun ice-breaker & networking session'
    ],
    format: 'Offline',
    venueOrLink: 'Main Campus Auditorium, Acropolis',
    date: '2026-08-15',
    time: '04:00 PM',
    status: 'Completed',
    attendeesCount: 48,
    attendedMemberNames: [
      'Rtr. Aarav Sharma', 'Rtr. Sneha Patel', 'Rtr. Rohan Verma', 'Rtr. Ananya Iyer',
      'Rtr. Vikram Malhotra', 'Rtr. Meera Nair', 'Rtr. Kabir Joshi', 'Rtr. Ishaan Mehta'
    ],
    momText: `1. Call to Order: Meeting convened at 04:05 PM by Secretary with 48 registered club members in attendance.\n2. Presidential Address: President congratulated the team for completing the Tree Plantation drive with 250+ saplings.\n3. Avenue Announcements: Community Service Director announced collaboration with local blood bank for upcoming camp on Sept 10th.\n4. Open Pitch Floor: 4 members pitched new initiatives: Digital Literacy for Elderly, Book Drive, Stray Animal Care, and Cyber Safety Workshop.\n5. Star Rotaractor of the Month: Awarded to Rtr. Kabir Joshi for highest on-ground volunteer hours in July.\n6. Adjournment: Meeting officially adjourned at 05:40 PM followed by light refreshments and fellowship.`,
    momFiledAt: '2026-08-15 18:30',
    momFiledBy: 'Secretary',
  },
  {
    id: 'MTG-2026-002',
    title: 'General Board Meeting #02 – Budget & Strategic Roadmaps',
    type: 'GBM',
    calledBy: 'President',
    agenda: 'Executive board approval for avenue budgets, vendor quotes for T-shirts and badges, and district dues payment timeline.',
    agendaItems: [
      'Scrutiny of Avenue budget estimates for Q1 and Q2',
      'Discussion on RI Dues ($5 + GST per member) & District dues allocation',
      'Approval of vendor quotations for member kits',
      'Discipline Score criteria formulation'
    ],
    format: 'Virtual',
    venueOrLink: 'https://meet.google.com/xyz-rotaract-board',
    date: '2026-07-22',
    time: '07:00 PM',
    status: 'Completed',
    attendeesCount: 13,
    attendedMemberNames: [
      'Rtr. Aarav Sharma', 'Rtr. Sneha Patel', 'Rtr. Rohan Verma', 'Rtr. Ananya Iyer', 
      'Rtr. Vikram Malhotra', 'Rtr. Meera Nair', 'Rtr. Priya Shah', 'Rtr. Devendra Chawla'
    ],
    momText: `1. Quorum Verification: Sergeant-at-Arms confirmed 13 Board Members present on the virtual call.\n2. Treasury Report: Treasurer presented audited financial statements showing total incoming dues of ₹1,20,000.\n3. Budget Resolutions: Unanimously approved ₹25,000 initial allocation for Community Service and ₹15,000 for Professional Development avenues.\n4. Rotary International Remittance: Resolved to remit District Dues (₹150/head) by August 5th and RI Capitation dues in compliance with bylaws.\n5. Meeting closed at 08:25 PM with secretarial vote of thanks.`,
    momFiledAt: '2026-07-23 11:00',
    momFiledBy: 'Secretary',
  },
  {
    id: 'MTG-2026-001',
    title: 'General Meeting #01 – RY Inauguration & Orientation',
    type: 'GM',
    calledBy: 'President',
    agenda: 'First general assembly of the new Rotary Year. Introduction of the Board of Directors to the entire membership body and keynote by Rotary Mentor.',
    agendaItems: [
      'Rotary Prayer & 4-Way Test recitation',
      'Collar Exchange ceremony & Presidential Vision Address',
      'Introduction of Board of Directors & Avenue Directors',
      'Release of Club Theme and Annual Calendar teaser',
      'Q&A with newly inducted members'
    ],
    format: 'Offline',
    venueOrLink: 'Acropolis Seminar Hall A',
    date: '2026-07-05',
    time: '11:00 AM',
    status: 'Completed',
    attendeesCount: 56,
    attendedMemberNames: [
      'Rtr. Aarav Sharma', 'Rtr. Sneha Patel', 'Rtr. Rohan Verma', 'Rtr. Ananya Iyer',
      'Rtr. Vikram Malhotra', 'Rtr. Kabir Joshi', 'Rtr. Priya Shah', 'Rtr. Devendra Chawla'
    ],
    momText: `1. The Inaugural General Meeting of Rotaract Club of Acropolis Royals for the Rotary Year was called to order at 11:00 AM.\n2. Rotarian Mentor highlighted the significance of community service and leadership development in youth.\n3. President laid down the vision: "Unite, Elevate, Transform", targeting 1,000+ service hours and 15+ high-impact community drives.\n4. All 14 Avenue Directors presented a 60-second summary of their planned programs.\n5. Over 56 members and prospective candidates registered attendance.\n6. Meeting successfully concluded at 01:15 PM followed by fellowship lunch.`,
    momFiledAt: '2026-07-05 16:00',
    momFiledBy: 'Secretary',
  }
];

export const MeetingsPage: React.FC = () => {
  const { activeMembers } = useApp();
  const [meetings, setMeetings] = useState<MeetingItem[]>(() => {
    const saved = localStorage.getItem('rotaract_meetings_archive');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_MEETINGS;
  });

  const saveMeetings = (updated: MeetingItem[]) => {
    setMeetings(updated);
    localStorage.setItem('rotaract_meetings_archive', JSON.stringify(updated));
  };

  // State filters & modals
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'GBM' | 'GM'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Scheduled'>('All');
  
  // Detail popup / MOM modal
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(null);
  
  // Schedule New Meeting modal
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [newMeetingForm, setNewMeetingForm] = useState({
    title: '',
    type: 'GBM' as 'GBM' | 'GM',
    calledBy: 'President',
    agenda: '',
    agendaItemsText: '',
    format: 'Offline' as 'Offline' | 'Virtual',
    venueOrLink: '',
    date: new Date().toISOString().split('T')[0],
    time: '05:30 PM',
  });

  // MOM Edit State (Inside detail modal)
  const [isEditingMOM, setIsEditingMOM] = useState(false);
  const [momDraft, setMomDraft] = useState('');
  const [attendeesCountDraft, setAttendeesCountDraft] = useState(0);
  const [editVenueDraft, setEditVenueDraft] = useState('');

  // Statistics calculation
  const totalMeetings = meetings.length;
  const completedMeetings = meetings.filter(m => m.status === 'Completed').length;
  const scheduledMeetings = meetings.filter(m => m.status === 'Scheduled').length;
  const momFiledMeetings = meetings.filter(m => m.status === 'Completed' && m.momText && m.momText.trim().length > 0).length;

  // Filtered list
  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const matchType = typeFilter === 'All' || m.type === typeFilter;
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchSearch = searchQuery.trim() === '' || 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.calledBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [meetings, typeFilter, statusFilter, searchQuery]);

  // Handler: Schedule new meeting
  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const items = newMeetingForm.agendaItemsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newMeeting: MeetingItem = {
      id: `MTG-2026-${String(meetings.length + 1).padStart(3, '0')}`,
      title: newMeetingForm.title || `${newMeetingForm.type === 'GBM' ? 'General Board Meeting' : 'General Meeting'} #${meetings.length + 1}`,
      type: newMeetingForm.type,
      calledBy: newMeetingForm.calledBy,
      agenda: newMeetingForm.agenda,
      agendaItems: items.length > 0 ? items : [newMeetingForm.agenda],
      format: newMeetingForm.format,
      venueOrLink: newMeetingForm.venueOrLink.trim() || undefined,
      date: newMeetingForm.date,
      time: newMeetingForm.time,
      status: 'Scheduled',
      attendeesCount: 0,
      attendedMemberNames: [],
      momText: '',
    };

    saveMeetings([newMeeting, ...meetings]);
    setIsScheduleOpen(false);
    setNewMeetingForm({
      title: '',
      type: 'GBM',
      calledBy: 'President',
      agenda: '',
      agendaItemsText: '',
      format: 'Offline',
      venueOrLink: '',
      date: new Date().toISOString().split('T')[0],
      time: '05:30 PM',
    });
  };

  // Handler: Open meeting detail modal
  const openMeetingDetail = (mtg: MeetingItem) => {
    setSelectedMeeting(mtg);
    setMomDraft(mtg.momText || '');
    setAttendeesCountDraft(mtg.attendeesCount || 0);
    setEditVenueDraft(mtg.venueOrLink || '');
    setIsEditingMOM(false);
  };

  // Handler: Save MOM & Mark as completed
  const handleSaveMOM = () => {
    if (!selectedMeeting) return;
    const updated: MeetingItem = {
      ...selectedMeeting,
      status: 'Completed',
      venueOrLink: editVenueDraft.trim() || selectedMeeting.venueOrLink,
      momText: momDraft,
      attendeesCount: Number(attendeesCountDraft) || selectedMeeting.attendeesCount,
      momFiledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      momFiledBy: 'Secretary',
    };

    const newMeetings = meetings.map(m => m.id === updated.id ? updated : m);
    saveMeetings(newMeetings);
    setSelectedMeeting(updated);
    setIsEditingMOM(false);
  };

  // Handler: Print / Download Meeting Report via hidden iframe (No blank tab!)
  const handleDownloadMeetingReport = (mtg: MeetingItem) => {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Meeting Report & MOM - ${mtg.title}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 2px solid #D41B2C; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
          .badge { display: inline-block; padding: 4px 10px; background: #fef3c7; color: #92400e; border-radius: 6px; font-size: 11px; font-weight: bold; }
          .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .meta-item { font-size: 13px; }
          .meta-label { font-weight: 700; color: #64748b; }
          .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          .agenda-list { margin: 0; padding-left: 20px; font-size: 13px; }
          .mom-box { background: #f1f5f9; padding: 14px; border-radius: 8px; border-left: 4px solid #F7A81B; white-space: pre-wrap; font-size: 13px; color: #334155; line-height: 1.7; }
          .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
          .signature-box { text-align: center; margin-top: 35px; font-size: 12px; }
          .signature-line { width: 160px; border-top: 1px solid #334155; margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">ROTARACT CLUB OF ACROPOLIS ROYALS</h1>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">Rotary International District 3040 | Official Meeting Report & MOM</p>
          </div>
          <div class="badge">${mtg.type === 'GBM' ? 'General Board Meeting (GBM)' : 'General Meeting (GM)'}</div>
        </div>

        <div class="meta-grid">
          <div class="meta-item"><span class="meta-label">Status:</span> ${mtg.status.toUpperCase()}</div>
          <div class="meta-item"><span class="meta-label">Meeting Name:</span> ${mtg.title}</div>
          <div class="meta-item"><span class="meta-label">Calling Authority:</span> ${mtg.calledBy}</div>
          <div class="meta-item"><span class="meta-label">Date & Time:</span> ${mtg.date} at ${mtg.time}</div>
          <div class="meta-item"><span class="meta-label">Format:</span> ${mtg.format}</div>
          <div class="meta-item"><span class="meta-label">Venue / Link:</span> ${mtg.venueOrLink || 'To be updated / Completed in person'}</div>
          <div class="meta-item"><span class="meta-label">Total Attendees:</span> ${mtg.attendeesCount > 0 ? `${mtg.attendeesCount} members recorded` : 'Pending Attendance Record'}</div>
        </div>

        <div class="section-title">MEETING AGENDA</div>
        <p style="font-size: 13px; color: #475569; margin-bottom: 10px;"><strong>Primary Objective:</strong> ${mtg.agenda}</p>
        <ol class="agenda-list">
          ${mtg.agendaItems.map(item => `<li>${item}</li>`).join('')}
        </ol>

        <div class="section-title">MINUTES OF MEETING (MOM) & RESOLUTIONS</div>
        ${mtg.momText && mtg.momText.trim().length > 0 
          ? `<div class="mom-box">${mtg.momText}</div>` 
          : `<div class="mom-box" style="color: #94a3b8; font-style: italic;">No Minutes of Meeting recorded for this session yet.</div>`
        }

        ${mtg.momFiledBy ? `
          <div style="font-size: 11px; color: #64748b; margin-top: 10px;">
            ✓ Recorded and certified by <strong>${mtg.momFiledBy}</strong> on ${mtg.momFiledAt || 'N/A'}.
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; margin-top: 45px;">
          <div class="signature-box">
            <div class="signature-line"></div>
            <strong>Secretary</strong><br/>Club Secretariat
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <strong>President</strong><br/>Club President
          </div>
        </div>

        <div class="footer">
          <span>Official RotaractOS Certified Document</span>
          <span>Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
        </div>
      </body>
      </html>
    `;

    // Seamless hidden iframe printing — no blank tab opened!
    const existingIframe = document.getElementById('meeting-print-iframe');
    if (existingIframe) existingIframe.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'meeting-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(reportHtml);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 250);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7A81B]/10 border border-[#F7A81B]/20 text-[#F7A81B] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" /> Official Governance & Secretariat
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Meetings & MOM Archive
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#F7A81B] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#F7A81B]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Schedule New Meeting
          </button>
        </div>

        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F7A81B]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Row (Cleaned: bottom helper lines removed) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Meetings', 
            value: totalMeetings.toString(), 
            color: 'text-white', 
            border: 'hover:border-white/30',
            bgGlow: 'group-hover:bg-white/5'
          },
          { 
            label: 'Completed', 
            value: completedMeetings.toString(), 
            color: 'text-emerald-400', 
            border: 'hover:border-emerald-500/30',
            bgGlow: 'group-hover:bg-emerald-500/5'
          },
          { 
            label: 'Scheduled', 
            value: scheduledMeetings.toString(), 
            color: 'text-[#F7A81B]', 
            border: 'hover:border-[#F7A81B]/30',
            bgGlow: 'group-hover:bg-[#F7A81B]/5'
          },
          { 
            label: 'MOM Filed', 
            value: momFiledMeetings.toString(), 
            color: 'text-sky-400', 
            border: 'hover:border-sky-500/30',
            bgGlow: 'group-hover:bg-sky-500/5'
          },
        ].map((s, i) => (
          <div 
            key={i} 
            className={`glass-panel p-5 rounded-2xl border border-white/10 transition-all duration-300 group ${s.border} relative overflow-hidden`}
          >
            <div className={`absolute inset-0 transition-colors duration-300 ${s.bgGlow}`} />
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Types Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start gap-4 hover:border-amber-500/30 transition-all">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                GBM
              </span>
              <h3 className="text-sm font-bold text-white">General Board Meeting</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Executive session for <strong>Board of Directors & Officers</strong> to pass resolutions, sanction projects, review finances, and establish policies.
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start gap-4 hover:border-sky-500/30 transition-all">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
                GM
              </span>
              <h3 className="text-sm font-bold text-white">General Meeting</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Open to <strong>all club members</strong> for fellowship, project pitches, member orientations, updates, and community initiatives.
            </p>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, agenda, or caller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F7A81B] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Type Filter */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            {(['All', 'GBM', 'GM'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#F7A81B] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'All' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            {(['All', 'Completed', 'Scheduled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-500 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No meetings found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No meetings matched your current search or filter options.
            </p>
          </div>
        ) : (
          filteredMeetings.map((mtg) => {
            const hasMOM = Boolean(mtg.momText && mtg.momText.trim().length > 0);

            return (
              <div 
                key={mtg.id}
                onClick={() => openMeetingDetail(mtg)}
                className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-[#F7A81B]/40 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer shadow-lg relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Meeting Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${
                        mtg.type === 'GBM'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                      }`}>
                        {mtg.type === 'GBM' ? 'General Board Meeting (GBM)' : 'General Meeting (GM)'}
                      </span>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                        mtg.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-[#F7A81B]/10 text-[#F7A81B] border-[#F7A81B]/20'
                      }`}>
                        {mtg.status === 'Completed' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-[#F7A81B]" /> Scheduled
                          </>
                        )}
                      </span>

                      {/* MOM Status Indicator Badge */}
                      {mtg.status === 'Completed' && (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                          hasMOM 
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          <FileText className="w-3 h-3" />
                          {hasMOM ? 'MOM Filed ✓' : 'MOM Not Submitted ✗'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#F7A81B] transition-colors">
                        {mtg.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {mtg.agenda}
                      </p>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <strong className="text-slate-300">{mtg.date}</strong> at {mtg.time}
                      </span>

                      <span className="flex items-center gap-1.5">
                        {mtg.format === 'Virtual' ? (
                          <Video className="w-3.5 h-3.5 text-sky-400" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span className="truncate max-w-[200px] text-slate-300">
                          {mtg.venueOrLink || (mtg.format === 'Virtual' ? 'Link to be shared' : 'Venue TBA')}
                        </span>
                      </span>

                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                        Called by: <span className="text-slate-300 font-medium">{mtg.calledBy}</span>
                      </span>

                      {mtg.status === 'Completed' && (
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-300">{mtg.attendeesCount} attended</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadMeetingReport(mtg);
                      }}
                      className="px-3.5 py-2 rounded-xl glass-panel hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 hover:border-[#F7A81B]/40 transition-all cursor-pointer"
                      title="Download or Print Meeting Report"
                    >
                      <Download className="w-3.5 h-3.5 text-[#F7A81B]" />
                      Report
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMeetingDetail(mtg);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-[#F7A81B] hover:text-slate-950 text-slate-200 text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details & MOM
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* SCHEDULE NEW MEETING MODAL (Portaled to document.body)                     */}
      {/* ========================================================================= */}
      {isScheduleOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsScheduleOpen(false)}
          />

          <div className="relative max-w-2xl w-full bg-[#0E131F] border border-white/15 rounded-3xl overflow-hidden z-10 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Schedule New Meeting</h2>
                  <p className="text-xs text-slate-400">Specify meeting agenda, calling authority, format, and schedule</p>
                </div>
              </div>
              <button 
                onClick={() => setIsScheduleOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateMeeting} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Meeting Type Selection */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Meeting Scope *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewMeetingForm(prev => ({ 
                      ...prev, 
                      type: 'GBM',
                      title: prev.title || 'General Board Meeting #0' + (meetings.length + 1)
                    }))}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      newMeetingForm.type === 'GBM'
                        ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-amber-400">GBM</span>
                      {newMeetingForm.type === 'GBM' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-sm font-bold text-white mt-1">General Board Meeting</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Board of Directors & Officers Only</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMeetingForm(prev => ({ 
                      ...prev, 
                      type: 'GM',
                      title: prev.title || 'General Meeting #0' + (meetings.length + 1)
                    }))}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      newMeetingForm.type === 'GM'
                        ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-lg shadow-sky-500/10'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-sky-400">GM</span>
                      {newMeetingForm.type === 'GM' && <Check className="w-4 h-4 text-sky-400" />}
                    </div>
                    <p className="text-sm font-bold text-white mt-1">General Meeting</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Open to All Enrolled Club Members</p>
                  </button>
                </div>
              </div>

              {/* Title & Calling Authority Dropdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMeetingForm.title}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, title: e.target.value })}
                    placeholder="e.g. General Board Meeting #05"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Calling Authority (Authorized Roles Only) *
                  </label>
                  <select
                    required
                    value={newMeetingForm.calledBy}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, calledBy: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  >
                    {AUTHORIZED_CALLERS.map(role => (
                      <option key={role} value={role} className="bg-slate-900 text-white">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Agenda of Meeting */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Agenda of Meeting *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newMeetingForm.agenda}
                  onChange={(e) => setNewMeetingForm({ ...newMeetingForm, agenda: e.target.value })}
                  placeholder="Summarize the core purpose and issues to be deliberated in this session..."
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                />
              </div>

              {/* Detailed Agenda Items (Points) */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Agenda Breakdown (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={newMeetingForm.agendaItemsText}
                  onChange={(e) => setNewMeetingForm({ ...newMeetingForm, agendaItemsText: e.target.value })}
                  placeholder="Call to Order&#10;Treasury & Dues review&#10;Flagship Project Plan&#10;AOB & Adjournment"
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-mono focus:border-[#F7A81B] focus:outline-none"
                />
              </div>

              {/* Format & Optional Venue / Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Format *
                  </label>
                  <select
                    value={newMeetingForm.format}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, format: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  >
                    <option value="Offline" className="bg-slate-900">Offline (In-Person)</option>
                    <option value="Virtual" className="bg-slate-900">Virtual (Online Link)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {newMeetingForm.format === 'Virtual' ? 'Meeting Link (URL)' : 'Campus Venue'}{' '}
                    <span className="text-slate-500 normal-case font-normal">(Optional — can be added later)</span>
                  </label>
                  <input
                    type="text"
                    value={newMeetingForm.venueOrLink}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, venueOrLink: e.target.value })}
                    placeholder={newMeetingForm.format === 'Virtual' ? 'Optional (e.g. Google Meet link)' : 'Optional (e.g. Seminar Hall A)'}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Date & Time with Clean Datepicker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F7A81B]" /> Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newMeetingForm.date}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#F7A81B]" /> Scheduled Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMeetingForm.time}
                    onChange={(e) => setNewMeetingForm({ ...newMeetingForm, time: e.target.value })}
                    placeholder="e.g. 05:30 PM"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F7A81B] to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#F7A81B]/20 hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Publish & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* MEETING DETAILS & MOM FILE POPUP MODAL (Portaled to document.body)        */}
      {/* ========================================================================= */}
      {selectedMeeting && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedMeeting(null)}
          />

          <div className="relative max-w-4xl w-full bg-[#0E131F] border border-white/15 rounded-3xl overflow-hidden z-10 shadow-2xl max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl border ${
                  selectedMeeting.type === 'GBM' 
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
                    : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                }`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                      selectedMeeting.type === 'GBM'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}>
                      {selectedMeeting.type === 'GBM' ? 'General Board Meeting' : 'General Meeting'}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white mt-0.5">{selectedMeeting.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadMeetingReport(selectedMeeting)}
                  className="px-3.5 py-2 rounded-xl glass-panel text-white text-xs font-bold border border-white/10 hover:border-[#F7A81B] flex items-center gap-2 transition-all cursor-pointer"
                  title="Download or Print Meeting Report"
                >
                  <Download className="w-4 h-4 text-[#F7A81B]" />
                  Download Report
                </button>
                <button 
                  onClick={() => setSelectedMeeting(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/30 p-4 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status</p>
                  <span className={`inline-flex items-center gap-1 font-bold text-xs mt-1 ${
                    selectedMeeting.status === 'Completed' ? 'text-emerald-400' : 'text-[#F7A81B]'
                  }`}>
                    {selectedMeeting.status === 'Completed' ? '✓ Completed' : '⏱ Scheduled'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Date & Time</p>
                  <p className="text-xs font-bold text-white mt-1">{selectedMeeting.date} at {selectedMeeting.time}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Format & Venue</p>
                  <p className="text-xs font-bold text-white mt-1 truncate">
                    {selectedMeeting.venueOrLink || (selectedMeeting.format === 'Virtual' ? 'Virtual (Link TBA)' : 'In-Person (TBA)')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Calling Authority</p>
                  <p className="text-xs font-bold text-white mt-1 truncate">{selectedMeeting.calledBy}</p>
                </div>
              </div>

              {/* Attendance Record Bar */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 text-slate-300">
                    <Users className="w-5 h-5 text-[#F7A81B]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Attendance Records</p>
                    <p className="text-[11px] text-slate-400">
                      {selectedMeeting.status === 'Completed' 
                        ? `${selectedMeeting.attendeesCount} verified attendees recorded.`
                        : `Attendance count will be certified upon meeting completion and MOM submission.`}
                    </p>
                  </div>
                </div>

                {selectedMeeting.status === 'Completed' && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      {selectedMeeting.attendeesCount} Members Present
                    </span>
                  </div>
                )}
              </div>

              {/* Agenda & Agenda Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F7A81B]" /> Meeting Agenda
                </h4>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3">
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {selectedMeeting.agenda}
                  </p>

                  {selectedMeeting.agendaItems && selectedMeeting.agendaItems.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Discussion Agenda Items:</p>
                      <ul className="space-y-1.5">
                        {selectedMeeting.agendaItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-white/5 text-[#F7A81B] font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="mt-0.5">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Minutes of Meeting (MOM) Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" /> Minutes of Meeting (MOM)
                  </h4>

                  {!isEditingMOM && (
                    <button
                      onClick={() => {
                        setMomDraft(selectedMeeting.momText || '');
                        setAttendeesCountDraft(selectedMeeting.attendeesCount || 0);
                        setEditVenueDraft(selectedMeeting.venueOrLink || '');
                        setIsEditingMOM(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#F7A81B] text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {selectedMeeting.momText ? 'Edit / Update MOM' : 'Enter / File MOM'}
                    </button>
                  )}
                </div>

                {/* If Editing MOM */}
                {isEditingMOM ? (
                  <div className="bg-black/50 p-5 rounded-2xl border border-sky-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold text-white">MOM Secretariat Editor</span>
                      </div>
                      <span className="text-[11px] text-slate-400">Saving this will automatically mark meeting as Completed</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Total Number of Members Attended
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={attendeesCountDraft}
                          onChange={(e) => setAttendeesCountDraft(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Confirmed Venue / Link
                        </label>
                        <input
                          type="text"
                          value={editVenueDraft}
                          onChange={(e) => setEditVenueDraft(e.target.value)}
                          placeholder="e.g. Seminar Hall A or Google Meet link"
                          className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Paste or Write Minutes of Meeting (Normal Text / Bullet points) *
                      </label>
                      <textarea
                        rows={8}
                        value={momDraft}
                        onChange={(e) => setMomDraft(e.target.value)}
                        placeholder="1. Call to order at 05:30 PM by President...&#10;2. Avenue resolutions discussed...&#10;3. Voted unanimously on project budget...&#10;4. Meeting adjourned at 06:45 PM."
                        className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-slate-200 text-xs font-mono leading-relaxed focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsEditingMOM(false)}
                        className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveMOM}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        Save & Certify MOM
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Recorded MOM or Missing Notice */
                  <div>
                    {selectedMeeting.momText && selectedMeeting.momText.trim().length > 0 ? (
                      <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Certified Official Minutes
                          </span>
                          <span>Filed by {selectedMeeting.momFiledBy || 'Secretary'} • {selectedMeeting.momFiledAt || 'Recorded'}</span>
                        </div>
                        <div className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-4 rounded-xl border border-white/5">
                          {selectedMeeting.momText}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                        <h4 className="text-sm font-bold text-rose-300">MOM Not Submitted</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Minutes of Meeting (MOM) have not been filed for this session yet. The Club Secretary or authorized officer can click below to paste the official text.
                        </p>
                        <button
                          onClick={() => {
                            setMomDraft('');
                            setAttendeesCountDraft(selectedMeeting.attendeesCount || 0);
                            setEditVenueDraft(selectedMeeting.venueOrLink || '');
                            setIsEditingMOM(true);
                          }}
                          className="mt-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> File MOM Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                Rotaract Club of Acropolis Royals • Secretariat Governance Module
              </span>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
