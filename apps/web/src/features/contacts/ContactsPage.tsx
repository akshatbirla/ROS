import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, Mail, Phone, Building, Users, Globe, Star, UserPlus, 
  ExternalLink, BookOpen, FileText, Download, ChevronLeft, ChevronRight, 
  X, Check, Plus, Trash2, Award, Sparkles, Eye, Shield, Tag, Bookmark
} from 'lucide-react';

export type ContactCategory = 
  | 'District Official' 
  | 'Faculty Coordinator' 
  | 'Club President (External)' 
  | 'Past President' 
  | 'Guest Speaker' 
  | 'Public Dignitary & Politician' 
  | 'Community & Event Partner'
  | 'Sister Club / Twin Club';

export interface ExternalContact {
  id: string;
  name: string;
  role: string;
  organizationOrClub: string;
  category: ContactCategory;
  email?: string;
  phone?: string;
  notes?: string;
  avatarColor: string;
}

export interface BookletPage {
  pageNumber: number;
  title: string;
  subtitle?: string;
  content: string[];
  tableData?: { headers: string[]; rows: string[][] };
  badge?: string;
}

export interface DistrictDocument {
  id: string;
  title: string;
  tagline: string;
  category: string;
  totalPages: number;
  coverColor: string;
  description: string;
  pages: BookletPage[];
}

const DISTRICT_DOCUMENTS: DistrictDocument[] = [
  {
    id: 'bravo-points',
    title: 'District Bravo Point System Guidebook',
    tagline: 'Official RID 3040 Club Evaluation & Citation Scoring Guidelines',
    category: 'District Scoring Metric',
    totalPages: 6,
    coverColor: 'from-amber-500 to-red-600',
    description: 'Comprehensive guidelines and scoring rubric for the Bravo Point System allocated across Club Service, Community, Professional Development, and International avenues.',
    pages: [
      {
        pageNumber: 1,
        title: 'Executive Overview & Scoring Philosophy',
        subtitle: 'Rotary International District 3040 Evaluation Manual',
        badge: 'Official District Metric',
        content: [
          'The Bravo Point System is the unified institutional scorecard measuring club performance, reporting cadence, and grassroots humanitarian impact across District 3040.',
          'Points are audited on a monthly basis by the District Secretariat and form the primary criteria for the Governor’s Citation and Star Club Platinum Trophy.',
          'Every active project must be accompanied by attendance rosters, high-resolution media proof, and validated accounts to qualify for point allocation.'
        ]
      },
      {
        pageNumber: 2,
        title: 'Club Service & Governance Matrix',
        subtitle: 'Section A: Meetings, Dues & Reporting Cadence',
        content: [
          'Monthly General Body Meetings (GBM): 100 Bravo Points per completed session with quorum and filed MOM.',
          'Board of Directors Meetings (BOD): 75 Bravo Points per month upon secretarial upload.',
          'Timely Monthly Report (MR) Submission: 250 Bravo Points if filed before the 5th of each calendar month on the District portal.',
          'RI Dues & District Dues on-time remittance: 500 Bonus Bravo Points.'
        ],
        tableData: {
          headers: ['Governance Deliverable', 'Reporting Window', 'Bravo Points'],
          rows: [
            ['Monthly Report (MR)', 'Before 5th of Month', '250 Pts'],
            ['GBM with Quorum & MOM', 'Monthly', '100 Pts'],
            ['Board of Directors Session', 'Bi-weekly / Monthly', '75 Pts'],
            ['Dues Clearance (RI + District)', 'By Aug 15th', '500 Pts'],
          ]
        }
      },
      {
        pageNumber: 3,
        title: 'Community Service & Humanitarian Drives',
        subtitle: 'Section B: Direct Beneficiary Impact Calculations',
        content: [
          'Community Blood Donation Drives: 15 Bravo Points per collected unit of blood (Min. 50 units for citation booster).',
          'Environmental & Tree Plantation Drives: 2 Bravo Points per verified surviving sapling with geotagged photographic proof.',
          'Educational & Literacy Outreach (Pathshala): 150 Bravo Points per educational kit distributed + 10 points per teaching hour.',
          'Disaster Relief & Slum Support Drives: 300 Bravo Points per sanction drive.'
        ]
      },
      {
        pageNumber: 4,
        title: 'Professional Development & Youth Skill Matrix',
        subtitle: 'Section C: Career Building & Leadership Workshops',
        content: [
          'Resume Writing & Corporate Interview Bootcamps: 150 Bravo Points per session.',
          'Industrial & Technological Field Visits: 200 Bravo Points with certified corporate host verification.',
          'Youth Leadership Training / Speaker Conclaves: 250 Bravo Points for keynote speaker engagements.',
          'Rotaract Youth Leadership Awards (RYLA) delegations: 50 Bravo Points per registered delegate.'
        ]
      },
      {
        pageNumber: 5,
        title: 'International Service & Cross-District Initiatives',
        subtitle: 'Section D: Global Fellowship & Rotaract Exchange',
        content: [
          'Twin Club Agreement Execution: 400 Bravo Points per bilateral agreement signed with international / cross-district club.',
          'Letterhead Exchange (LHE) & Joint Assembly: 75 Bravo Points per international meeting session.',
          'Global Cultural & Peace Conclaves: 200 Bravo Points per hosted session.',
          'Participation in World Rotaract Week initiatives: 350 Bravo Points.'
        ]
      },
      {
        pageNumber: 6,
        title: 'Penalties, Grievance Redressal & Certification',
        subtitle: 'Section E: Compliance & Audit Disclaimers',
        content: [
          'Delayed Report Filing: 50 Points deducted per day of delay past the 10th of the submission month.',
          'Fabricated or duplicated attendee proof: Zero points for the event + disciplinary referral to District Council.',
          'Point disputes must be submitted within 7 business days of monthly bulletin publishing.',
          'Certified by District Rotaract Representative & District Awards Committee Chairman.'
        ]
      }
    ]
  },
  {
    id: 'prashikshan-granth',
    title: 'Prashikshan Granth — Leadership Manual',
    tagline: 'District 3040 Officer Training & Secretarial Protocol Scripture',
    category: 'Institutional Scripture',
    totalPages: 4,
    coverColor: 'from-blue-600 to-indigo-800',
    description: 'The definitive officer playbook covering parliamentary procedures, gavel etiquette, collar protocol, agendas, and secretarial duties.',
    pages: [
      {
        pageNumber: 1,
        title: 'Foundations of Rotaract Leadership',
        subtitle: 'Chapter I: Philosophy, The 4-Way Test & Officer Oaths',
        badge: 'Protocol Scripture',
        content: [
          'Prashikshan Granth embodies the standard operating procedures of Rotary International District 3040 for incoming leaders.',
          'The 4-Way Test of the things we think, say, or do:',
          '1. Is it the TRUTH?',
          '2. Is it FAIR to all concerned?',
          '3. Will it build GOODWILL and BETTER FRIENDSHIPS?',
          '4. Will it be BENEFICIAL to all concerned?',
          'Every club meeting must commence with call to order by the presiding officer followed by the 4-Way Test.'
        ]
      },
      {
        pageNumber: 2,
        title: 'Parliamentary Procedure & Gavel Decorum',
        subtitle: 'Chapter II: Meeting Rules & Order of Business',
        content: [
          'Single Gavel Strike: Calls the meeting to order, signals the passage of a motion, or announces adjournment.',
          'Two Gavel Strikes: Calls all members in the room to stand.',
          'Three Gavel Strikes: Used to direct members to rise for national anthem or the Rotary invocation prayer.',
          'Presiding officers must maintain political neutrality and uphold decorum during debate.'
        ]
      },
      {
        pageNumber: 3,
        title: 'President & Secretarial Protocols',
        subtitle: 'Chapter III: Collar Dignity & Minute Ledger Maintenance',
        content: [
          'Presidential Collar Protocol: The collar must only be worn by the active President during official business meetings and district conclaves.',
          'Never wear the collar while consuming food, walking casually in public, or outside the official event perimeter.',
          'Secretarial Registers: Minutes of Meetings (MOM) must be recorded chronologically, capturing exact voter counts, mover, and seconder names.',
          'Attendance rosters must record member signatures and RI membership IDs.'
        ]
      },
      {
        pageNumber: 4,
        title: 'The Sergeant-at-Arms Code',
        subtitle: 'Chapter IV: Hall Discipline, Protocol Fines & Fellowship Ethics',
        content: [
          'The Sergeant-at-Arms is the constitutional guardian of decorum, seating hierarchies, and punctuality.',
          'Authorized to levy light symbolic fellowship fines for mobile phone interruptions or unparliamentary conduct.',
          'Responsible for collar safekeeping, national and Rotary flag positioning, and banner exchange ceremonies.'
        ]
      }
    ]
  },
  {
    id: 'sister-twin-criteria',
    title: 'Sister Club & Twin Club Criteria Guidelines',
    tagline: 'Standard Operating Procedures for Inter-Club & Cross-District Bilateral Alliances',
    category: 'International Relations',
    totalPages: 4,
    coverColor: 'from-emerald-600 to-teal-800',
    description: 'Statutory requirements, agreement templates, joint project responsibilities, and letterhead exchange protocol for establishing formal Sister Club relations.',
    pages: [
      {
        pageNumber: 1,
        title: 'Definitions & Institutional Purpose',
        subtitle: 'Bilateral Rotaract Fellowship & Cross-Border Alliances',
        badge: 'International Protocol',
        content: [
          'A Sister Club Agreement unites two clubs within different districts or countries to share intellectual resources, execute joint humanitarian projects, and foster long-term fellowship.',
          'A Twin Club Alliance requires a signed memorandum of understanding (MoU) with specific joint commitments spanning at least one full Rotary Year.',
          'Both clubs must be in good financial standing with their respective District Governors and Rotary International.'
        ]
      },
      {
        pageNumber: 2,
        title: 'Eligibility Checklist for Signing Club',
        subtitle: 'Statutory Requirements Prior to Agreement Sanction',
        content: [
          'Minimum Club Age: Must be chartered for at least 12 months with active charter status.',
          'Financial Standing: 100% of club members cleared on Rotary International database.',
          'Sponsoring Rotary Club Sanction: Written endorsement letter signed by the President or Youth Service Director of the Parent Rotary Club.',
          'Board Resolution: Passed with two-thirds majority in an official General Board Meeting (GBM).'
        ]
      },
      {
        pageNumber: 3,
        title: 'Standard Joint Commitments (MoU)',
        subtitle: 'Mandatory Deliverables of Twin Club Relationships',
        content: [
          'Execute a minimum of two (2) joint projects within the Rotary Year (one local community drive and one joint webinar/fellowship exchange).',
          'Conduct at least one joint General Meeting via digital conference (Zoom / Google Meet).',
          'Regular exchange of club monthly bulletins, project reports, and social media cross-promotion.',
          'Extend warm hospitality and lodging assistance to traveling delegates of the partner club.'
        ]
      },
      {
        pageNumber: 4,
        title: 'Execution & Certification Steps',
        subtitle: 'Formal Collar Signing & District Recognition',
        content: [
          '1. Draft bilateral MoU using standard District 3040 template.',
          '2. Signatures executed by Presidents, Secretaries, and International Service Directors of both clubs.',
          '3. Exchange of official Club Flags & Letterhead Exchange (LHE) during physical or virtual ceremony.',
          '4. Submission of signed agreement to District International Service Committee (DISC) for official Bravo point allocation.'
        ]
      }
    ]
  }
];

const INITIAL_CONTACTS: ExternalContact[] = [
  {
    id: 'C-001',
    name: 'Rtr. Siddharth Mehrotra',
    role: 'District Rotaract Representative (DRR)',
    organizationOrClub: 'Rotary International District 3040',
    category: 'District Official',
    email: 'drr@rid3040.org',
    phone: '+91 98100 00001',
    notes: 'District Head for Rotary Year 2026-27. Primary contact for district sanction and official Governor visit.',
    avatarColor: 'from-[#F7A81B] to-amber-600'
  },
  {
    id: 'C-002',
    name: 'Dr. V. K. Jain',
    role: 'Head Faculty Coordinator & Dean',
    organizationOrClub: 'Acropolis Institute of Technology & Science',
    category: 'Faculty Coordinator',
    email: 'vkjain@acropolis.in',
    phone: '+91 98765 11111',
    notes: 'Institutional authority for campus auditorium booking, administrative permissions, and college event NOCs.',
    avatarColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'C-003',
    name: 'Prof. Neeta Sharma',
    role: 'Faculty Student Advisor',
    organizationOrClub: 'Acropolis Institute of Technology & Science',
    category: 'Faculty Coordinator',
    email: 'neeta.sharma@acropolis.in',
    phone: '+91 98765 22222',
    notes: 'Primary liaison for on-ground student attendance approvals and academic balance.',
    avatarColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'C-004',
    name: 'Rtr. Yashwardhan Deshmukh',
    role: 'Club President (RY 2026-27)',
    organizationOrClub: 'Rotaract Club of Indore Professionals',
    category: 'Club President (External)',
    email: 'president.rcip@gmail.com',
    phone: '+91 98260 34567',
    notes: 'Key partner for city-wide mega blood donation drives and youth professional conclaves.',
    avatarColor: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'C-005',
    name: 'Rtr. PP Kavya Nair',
    role: 'Immediate Past President (IPP)',
    organizationOrClub: 'Rotaract Club of Acropolis Royals',
    category: 'Past President',
    email: 'kavya.nair@gmail.com',
    phone: '+91 99001 33333',
    notes: 'RY 2025-26 President. Available for advisory council and dispute mediation.',
    avatarColor: 'from-violet-500 to-purple-600'
  },
  {
    id: 'C-006',
    name: 'Dr. Amit Agrawal',
    role: 'Keynote Speaker & Mental Health Evangelist',
    organizationOrClub: 'MindCraft Wellness Foundation',
    category: 'Guest Speaker',
    email: 'dr.amit@mindcraft.org',
    phone: '+91 94250 88990',
    notes: 'Delivered keynote during Mental Health Awareness Conclave. Open for student workshops.',
    avatarColor: 'from-pink-500 to-rose-600'
  },
  {
    id: 'C-007',
    name: 'Shri R. K. Patidar',
    role: 'Municipal Corporator & Social Worker',
    organizationOrClub: 'Indore Municipal Corporation (Ward 42)',
    category: 'Public Dignitary & Politician',
    email: 'rkpatidar.social@gmail.com',
    phone: '+91 98270 12345',
    notes: 'Facilitates civic support for tree plantation, cleanliness drives, and public park access.',
    avatarColor: 'from-amber-600 to-red-600'
  },
  {
    id: 'C-008',
    name: 'Indore Blood Bank & Red Cross Society',
    role: 'Medical & Logistics Partner',
    organizationOrClub: 'Red Cross Hospital Society, Indore',
    category: 'Community & Event Partner',
    email: 'bloodbank.indore@redcross.org',
    phone: '+91 731 254 0000',
    notes: 'Provides medical team, blood collection van, doctor supervision, and donor refresh kits.',
    avatarColor: 'from-[#D41B2C] to-red-700'
  },
  {
    id: 'C-009',
    name: 'Rotaract Club of Colombo Central',
    role: 'International Twin Club Alliance',
    organizationOrClub: 'Rotaract District 3220 (Sri Lanka)',
    category: 'Sister Club / Twin Club',
    email: 'rotaract.colombocentral@gmail.com',
    phone: '+94 77 123 4567',
    notes: 'Signed Twin Club Agreement for international cultural webinars and peace fellowship.',
    avatarColor: 'from-teal-500 to-cyan-600'
  }
];

const CATEGORIES: ContactCategory[] = [
  'District Official',
  'Faculty Coordinator',
  'Club President (External)',
  'Past President',
  'Guest Speaker',
  'Public Dignitary & Politician',
  'Community & Event Partner',
  'Sister Club / Twin Club'
];

export const ContactsPage: React.FC = () => {
  // Contacts state with local persistence
  const [contacts, setContacts] = useState<ExternalContact[]>(() => {
    const saved = localStorage.getItem('rotaract_external_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CONTACTS;
  });

  const saveContacts = (updated: ExternalContact[]) => {
    setContacts(updated);
    localStorage.setItem('rotaract_external_contacts', JSON.stringify(updated));
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Section Navigation Tabs: Contacts Directory vs District Documents
  const [activeSection, setActiveSection] = useState<'contacts' | 'documents'>('contacts');

  // Contact Modal (Add/Edit)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ExternalContact | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    role: '',
    organizationOrClub: '',
    category: 'District Official' as ContactCategory,
    email: '',
    phone: '',
    notes: '',
  });

  // Booklet Flip-Book Modal
  const [activeBooklet, setActiveBooklet] = useState<DistrictDocument | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.organizationOrClub.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [contacts, selectedCategory, searchQuery]);

  // Handlers: Contact Form
  const openAddContact = () => {
    setEditingContact(null);
    setContactForm({
      name: '',
      role: '',
      organizationOrClub: '',
      category: 'District Official',
      email: '',
      phone: '',
      notes: '',
    });
    setIsContactModalOpen(true);
  };

  const openEditContact = (c: ExternalContact) => {
    setEditingContact(c);
    setContactForm({
      name: c.name,
      role: c.role,
      organizationOrClub: c.organizationOrClub,
      category: c.category,
      email: c.email || '',
      phone: c.phone || '',
      notes: c.notes || '',
    });
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      const updated = contacts.map(c => c.id === editingContact.id ? {
        ...c,
        ...contactForm,
      } : c);
      saveContacts(updated);
    } else {
      const colors = [
        'from-amber-500 to-red-600',
        'from-blue-500 to-indigo-600',
        'from-emerald-500 to-teal-600',
        'from-violet-500 to-purple-600',
        'from-pink-500 to-rose-600',
        'from-teal-500 to-cyan-600'
      ];
      const newContact: ExternalContact = {
        id: `C-${Date.now()}`,
        ...contactForm,
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
      };
      saveContacts([newContact, ...contacts]);
    }
    setIsContactModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact from the directory?')) {
      const updated = contacts.filter(c => c.id !== id);
      saveContacts(updated);
      setIsContactModalOpen(false);
    }
  };

  // Booklet Navigation
  const openBooklet = (doc: DistrictDocument) => {
    setActiveBooklet(doc);
    setCurrentPageIndex(0);
  };

  const nextPage = () => {
    if (!activeBooklet) return;
    if (currentPageIndex < activeBooklet.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7A81B]/10 border border-[#F7A81B]/20 text-[#F7A81B] text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" /> District Protocol & Stakeholder Relations
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            External Roster & Directory
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Centralized Rolodex of district leadership, college coordinators, partner clubs, keynote speakers, and official District 3040 governance literature.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={openAddContact}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#F7A81B] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#F7A81B]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[3]" /> Add New Contact
          </button>
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F7A81B]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveSection('contacts')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'contacts'
              ? 'bg-[#F7A81B] text-slate-950 shadow-lg shadow-[#F7A81B]/20 font-black'
              : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          External Contacts Roster ({contacts.length})
        </button>

        <button
          onClick={() => setActiveSection('documents')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'documents'
              ? 'bg-[#F7A81B] text-slate-950 shadow-lg shadow-[#F7A81B]/20 font-black'
              : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          District Manuals & Flip-Booklets ({DISTRICT_DOCUMENTS.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CONTACTS DIRECTORY                                             */}
      {/* ========================================================================= */}
      {activeSection === 'contacts' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, role, organization, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F7A81B] transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-[#F7A81B] text-slate-950 shadow-md'
                    : 'glass-panel text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                All Contacts
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white/20 text-white shadow-md border border-white/30'
                      : 'glass-panel text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.length === 0 ? (
              <div className="col-span-full glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No contacts found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No directory records match your current search or category filter.
                </p>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => openEditContact(contact)}
                  className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-[#F7A81B]/40 hover:bg-white/[0.03] transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-lg relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md`}>
                          {contact.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-[#F7A81B] transition-colors leading-snug">
                            {contact.name}
                          </h3>
                          <p className="text-xs text-[#F7A81B] font-medium leading-tight">
                            {contact.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10">
                        {contact.category}
                      </span>
                      <p className="text-xs text-slate-400 font-medium">
                        {contact.organizationOrClub}
                      </p>
                    </div>

                    {contact.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                        {contact.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 mt-4 space-y-1.5 text-xs text-slate-400">
                    {contact.email && (
                      <div className="flex items-center gap-2 hover:text-white transition-colors truncate">
                        <Mail className="w-3.5 h-3.5 text-[#F7A81B] shrink-0" />
                        <a href={`mailto:${contact.email}`} onClick={e => e.stopPropagation()} className="truncate hover:underline">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <a href={`tel:${contact.phone}`} onClick={e => e.stopPropagation()} className="hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: DISTRICT MANUALS & INTERACTIVE BOOKLETS                        */}
      {/* ========================================================================= */}
      {activeSection === 'documents' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">District Literature & Governance Guidelines</h3>
                <p className="text-xs text-slate-400">
                  Interactive flip-book reader for official point matrices, secretarial scriptures, and inter-club protocols.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DISTRICT_DOCUMENTS.map(doc => (
              <div
                key={doc.id}
                onClick={() => openBooklet(doc)}
                className="glass-panel rounded-3xl border border-white/10 hover:border-[#F7A81B]/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between overflow-hidden shadow-xl hover:scale-[1.01]"
              >
                {/* Booklet Cover Preview */}
                <div className={`p-6 bg-gradient-to-br ${doc.coverColor} relative overflow-hidden flex flex-col justify-between min-h-[180px]`}>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-black uppercase text-white tracking-wider border border-white/20">
                      {doc.category}
                    </span>
                    <span className="text-xs font-black text-white/80 bg-black/20 px-2 py-0.5 rounded">
                      {doc.totalPages} Pages
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white leading-tight drop-shadow-md">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-white/80 mt-1 line-clamp-2">
                      {doc.tagline}
                    </p>
                  </div>

                  {/* Spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20" />
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-black/20">
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#F7A81B] flex items-center gap-1 group-hover:underline">
                      <BookOpen className="w-3.5 h-3.5" /> Read Booklet
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      Interactive Flip-Reader →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE FLIP-BOOKLET MODAL (Portaled to document.body)                */}
      {/* ========================================================================= */}
      {activeBooklet && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
            onClick={() => setActiveBooklet(null)}
          />

          <div className="relative max-w-4xl w-full bg-[#0E131F] border border-white/20 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Booklet Header */}
            <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white truncate max-w-md">
                    {activeBooklet.title}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    District 3040 Booklet • Page {currentPageIndex + 1} of {activeBooklet.pages.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl glass-panel text-xs text-white border border-white/10 hover:border-[#F7A81B] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#F7A81B]" /> Print / PDF
                </button>
                <button
                  onClick={() => setActiveBooklet(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Booklet Page Body (Realistic Document Page) */}
            <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-gradient-to-b from-slate-900/90 to-black/95">
              <div className="max-w-2xl mx-auto bg-[#131927] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
                {/* Booklet Spine / Header Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#F7A81B] bg-[#F7A81B]/10 px-2.5 py-1 rounded-md border border-[#F7A81B]/20">
                    {activeBooklet.pages[currentPageIndex]?.badge || activeBooklet.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    PAGE {currentPageIndex + 1} / {activeBooklet.pages.length}
                  </span>
                </div>

                {/* Page Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      {activeBooklet.pages[currentPageIndex]?.title}
                    </h3>
                    {activeBooklet.pages[currentPageIndex]?.subtitle && (
                      <p className="text-xs font-medium text-slate-400 mt-1">
                        {activeBooklet.pages[currentPageIndex].subtitle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    {activeBooklet.pages[currentPageIndex]?.content.map((paragraph, idx) => (
                      <p key={idx} className="text-xs text-slate-300 leading-relaxed font-sans">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Optional Table for Matrices */}
                  {activeBooklet.pages[currentPageIndex]?.tableData && (
                    <div className="pt-2">
                      <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                            <tr>
                              {activeBooklet.pages[currentPageIndex].tableData!.headers.map((h, i) => (
                                <th key={i} className="p-2.5 font-bold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-[11px]">
                            {activeBooklet.pages[currentPageIndex].tableData!.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-white/[0.02]">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2.5">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer of Page */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Rotary International District 3040</span>
                  <span>Rotaract Club of Acropolis Royals Secretariat</span>
                </div>
              </div>
            </div>

            {/* Booklet Navigation Controls Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <button
                onClick={prevPage}
                disabled={currentPageIndex === 0}
                className="px-4 py-2 rounded-xl glass-panel text-xs font-bold text-white border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Page
              </button>

              <div className="flex items-center gap-1.5">
                {activeBooklet.pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentPageIndex === idx ? 'bg-[#F7A81B] w-6' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    title={`Jump to Page ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPageIndex === activeBooklet.pages.length - 1}
                className="px-4 py-2 rounded-xl bg-[#F7A81B] text-slate-950 font-bold text-xs hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                Next Page <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT CONTACT MODAL (Portaled to document.body)                       */}
      {/* ========================================================================= */}
      {isContactModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsContactModalOpen(false)}
          />

          <div className="relative max-w-lg w-full bg-[#0E131F] border border-white/15 rounded-3xl overflow-hidden z-10 shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">
                    {editingContact ? 'Edit Contact Details' : 'Add External Contact'}
                  </h2>
                  <p className="text-xs text-slate-400">Save stakeholder records into the club directory</p>
                </div>
              </div>
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveContact} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name & Salutation *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Rtr. Siddharth Mehrotra or Dr. V. K. Jain"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Designation / Role *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.role}
                  onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                  placeholder="e.g. District Rotaract Representative or Faculty Coordinator"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Category *
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value as ContactCategory })}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Organization / Club *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.organizationOrClub}
                    onChange={(e) => setContactForm({ ...contactForm, organizationOrClub: e.target.value })}
                    placeholder="e.g. RID 3040 or Acropolis"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="contact@domain.org"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7A81B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Stakeholder Notes & Event Collaboration Context
                </label>
                <textarea
                  rows={3}
                  value={contactForm.notes}
                  onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                  placeholder="e.g. Key authority for campus approvals; helped sponsor 2026 Blood Donation Camp..."
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7A81B] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                {editingContact ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(editingContact.id)}
                    className="px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F7A81B] to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#F7A81B]/20 hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    {editingContact ? 'Save Changes' : 'Save Contact'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
