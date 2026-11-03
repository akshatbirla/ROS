import React, { createContext, useContext, useState, useEffect } from 'react';
import { CandidateMember, parseGoogleSheetCsv } from '../features/members/memberUtils';
import { supabase } from '../lib/supabaseClient';

export interface ExpenseItem {
  name: string;
  cost: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  receipt: string;
  verifiedBy: string;
  items?: ExpenseItem[];
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  avenue?: string;
  image: string;
}

export interface FlagshipProject {
  id: string;
  title: string;
  desc: string;
  about: string;
  img: string;
  color: string;
  gallery: string[];
}

export interface GalleryPhoto {
  id: string;
  img: string;
  eventName: string;
}

export interface FeaturedAlbum {
  id: string;
  title: string;
  image: string;
  description?: string;
  photos?: string[];
}

export interface AppSettings {
  showBoardOfDirectors: boolean;
  welcomeText: string;
  heroBannerUrl: string;
  presidentImage?: string;
  boardOfDirectors: BoardMember[];
  whoWeAreImages?: string[];
  whoWeAreText?: string;
  flagshipProjects?: FlagshipProject[];
  photoGallery?: GalleryPhoto[];
  galleryDriveLink?: string;
  featuredAlbums?: FeaturedAlbum[];
}

export interface RotaractEvent {
  id: string;
  name: string;
  lead?: string;
  avenue: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  about: string;
  status: 'pending_approval' | 'approved' | 'happened';
  actualDate?: string;
  actualTime?: string;
  actualDurationHours?: number;
  beneficiaries?: number;
  photos?: string[];
  driveLink?: string;
  nominatedMemberIds: string[];
  posterUrl?: string;
  formLink?: string;
  publicStatus?: 'Upcoming' | 'Ongoing' | 'Completed';
  isPublic?: boolean;
  likes?: number;
  shares?: number;
}

export interface EventReport {
  eventId: string;
  pdfDataUrl: string; 
  uploadedAt: string;
}

export interface MonthlyReport {
  monthKey: string; 
  pdfDataUrl: string;
  uploadedAt: string;
}

interface AppContextType {
  activeMembers: CandidateMember[];
  pendingCandidates: CandidateMember[];
  addedMemberKeys: Set<string>;
  isSyncing: boolean;
  addMember: (candidate: CandidateMember) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  deleteCandidate: (candidateId: string) => void;
  fetchLiveGoogleSheet: () => Promise<void>;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'receipt' | 'verifiedBy'> & { verifiedBy?: string }) => Promise<void>;
  deleteTransaction: (txId: string) => Promise<void>;

  appSettings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;

  events: RotaractEvent[];
  addEvent: (event: Omit<RotaractEvent, 'id' | 'status' | 'nominatedMemberIds'>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<RotaractEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;

  eventReports: EventReport[];
  monthlyReports: MonthlyReport[];
  uploadEventReport: (eventId: string, pdfDataUrl: string) => Promise<void>;
  uploadMonthlyReport: (monthKey: string, pdfDataUrl: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMembers, setActiveMembers] = useState<CandidateMember[]>([]);
  const [pendingCandidates, setPendingCandidates] = useState<CandidateMember[]>([]);
  const [addedMemberKeys, setAddedMemberKeys] = useState<Set<string>>(new Set());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const [appSettings, setAppSettings] = useState<AppSettings>({
    showBoardOfDirectors: true,
    welcomeText: "Connecting passionate Rotaractors, streamlining projects, and driving meaningful impact.",
    heroBannerUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=2000&q=80",
    whoWeAreText: "We are a community of young leaders driven by the Rotary motto of \"Service Above Self\". The Rotaract Club of Acropolis Royals is dedicated to creating positive change, fostering fellowship, and developing professional skills among our members.\n\nThrough various avenues of service, we impact lives, build sustainable solutions, and empower the next generation of changemakers. Join us in our journey of making the world a better place, one project at a time.",
    whoWeAreImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"
    ],
    flagshipProjects: [
      { 
        id: "paws", title: "Paws and Claws", desc: "Animal welfare initiative focused on feeding, vaccinating, and sheltering stray dogs and cats.", 
        about: "Paws and Claws is our dedicated animal welfare initiative. We organize regular feeding drives, coordinate with local vets for vaccination camps, and find loving homes for strays.",
        img: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80", 
        color: "from-amber-500/80", gallery: ["https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80"] 
      },
      { 
        id: "readers", title: "Reader's Round Table", desc: "A literary fellowship fostering book discussions, intellectual exchange, and reading activities.", 
        about: "Reader's Round Table brings together bibliophiles to share insights, debate ideas, and promote the love of reading in our community.",
        img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80", 
        color: "from-sky-500/80", gallery: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"] 
      },
      { 
        id: "nayi", title: "Nayi Disha", desc: "A widespread awareness campaign against drug abuse, promoting healthy and active lifestyles.", 
        about: "Nayi Disha aims to guide the youth away from substance abuse through workshops, expert talks, and community outreach programs.",
        img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80", 
        color: "from-emerald-500/80", gallery: ["https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"] 
      },
      { 
        id: "pathshala", title: "Pathshala", desc: "Educational outreach program teaching underprivileged children in government schools and slums.", 
        about: "Pathshala is our commitment to education equity. Volunteers spend their weekends teaching fundamental subjects to children who lack access to quality education.",
        img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80", 
        color: "from-[#F7A81B]/80", gallery: ["https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"] 
      }
    ],
    photoGallery: [
      { id: "1", img: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80", eventName: "Paws and Claws Feeding Drive" },
      { id: "2", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80", eventName: "Reader's Round Table" },
      { id: "3", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80", eventName: "Nayi Disha Campaign" },
      { id: "4", img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80", eventName: "Pathshala Education Outreach" },
      { id: "5", img: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=600&q=80", eventName: "Blood Donation Camp" },
      { id: "6", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80", eventName: "Tree Plantation Drive" }
    ],
    galleryDriveLink: "https://drive.google.com/drive/folders/1xyz",
    featuredAlbums: [
      { 
        id: 'a1', 
        title: 'District Conference 2026', 
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        description: 'Annual District 3040 Conference gathering over 800+ passionate Rotaractors, district governors, and international delegates for three days of keynotes, awards, and fellowship.',
        photos: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
        ]
      },
      { 
        id: 'a2', 
        title: 'Installation Ceremony', 
        image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
        description: 'The formal presidential collar exchange and board pinning banquet marking the inauguration of the Rotary Year 2026-27.',
        photos: [
          'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80'
        ]
      },
      { 
        id: 'a3', 
        title: 'RYLA Weekend Retreat', 
        image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80',
        description: 'Rotaract Youth Leadership Awards off-site retreat focusing on team dynamics, survival challenges, and ethical problem solving.',
        photos: [
          'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
        ]
      },
      { 
        id: 'a4', 
        title: 'Community Outreach', 
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
        description: 'City-wide multi-avenue community drive distributing education kits, warm clothes, and organizing health checks.',
        photos: [
          'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ],
    presidentImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    boardOfDirectors: []
  });
  
  const [events, setEvents] = useState<RotaractEvent[]>([]);
  const [eventReports, setEventReports] = useState<EventReport[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);

  // Load all initial data from Supabase
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Settings
        const { data: settingsData } = await supabase.from('app_settings').select('*').single();
        if (settingsData) {
          let currentBod = settingsData.board_of_directors || [];
          if (currentBod.length === 0) {
            currentBod = [
              { id: 'bod-1', name: 'Update in Settings', role: 'Club Faculty Advisor', image: '', avenue: '' },
              { id: 'bod-2', name: 'Update in Settings', role: 'President', image: '', avenue: 'Executive Board' },
              { id: 'bod-3', name: 'Update in Settings', role: 'Secretary', image: '', avenue: 'Executive Board' }
            ];
            // Auto-save the defaults so they are editable
            await supabase.from('app_settings').update({ board_of_directors: currentBod }).eq('id', 1);
          }

          setAppSettings({
            showBoardOfDirectors: settingsData.show_board_of_directors,
            welcomeText: settingsData.welcome_text,
            heroBannerUrl: settingsData.hero_banner_url,
            boardOfDirectors: currentBod
          });
        }

        // 2. Active Members
        const { data: membersData } = await supabase.from('active_members').select('*');
        if (membersData) {
          const mappedMembers = membersData.map(m => ({
            id: m.id,
            name: m.name,
            contactNo: m.contact_no,
            email: m.email,
            dob: m.dob,
            photoUrl: m.photo_url,
            course: m.course,
            currentYear: m.current_year,
            section: m.section,
            enrollmentNo: m.enrollment_no,
            domainsInterest: m.domains_interest,
            riMembershipId: m.ri_membership_id,
            designation: m.designation,
            bio: m.bio,
            disciplineScore: m.discipline_score,
            status: m.status
          }));
          setActiveMembers(mappedMembers);
          setAddedMemberKeys(new Set(mappedMembers.map(m => m.enrollmentNo || m.email || m.id)));
        }

        // 3. Transactions
        const { data: txData } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (txData) {
          setTransactions(txData.map(t => ({
            id: t.id,
            date: t.date,
            description: t.description,
            category: t.category,
            type: t.type,
            amount: t.amount,
            receipt: t.receipt,
            verifiedBy: t.verified_by
          })));
        }

        // 4. Events
        const { data: eventsData } = await supabase.from('events').select('*');
        if (eventsData) {
          setEvents(eventsData.map(e => ({
            id: e.id,
            name: e.name,
            avenue: e.avenue,
            date: e.date,
            startTime: e.start_time,
            endTime: e.end_time,
            venue: e.venue,
            about: e.about,
            status: e.status,
            actualDate: e.actual_date,
            actualTime: e.actual_time,
            actualDurationHours: e.actual_duration_hours,
            beneficiaries: e.beneficiaries,
            nominatedMemberIds: e.nominated_member_ids || [],
            posterUrl: e.poster_url,
            formLink: e.form_link,
            publicStatus: e.public_status,
            isPublic: e.is_public || false,
            likes: e.likes || 0,
            shares: e.shares || 0
          })));
        }

        // 5. Reports
        const { data: evtReports } = await supabase.from('event_reports').select('*');
        if (evtReports) setEventReports(evtReports.map(r => ({ eventId: r.event_id, pdfDataUrl: r.pdf_data_url, uploadedAt: r.uploaded_at })));

        const { data: mthReports } = await supabase.from('monthly_reports').select('*');
        if (mthReports) setMonthlyReports(mthReports.map(r => ({ monthKey: r.month_key, pdfDataUrl: r.pdf_data_url, uploadedAt: r.uploaded_at })));

      } catch (err) {
        console.error("Error loading data from Supabase:", err);
      }
    };

    fetchAllData();
    fetchLiveGoogleSheet();
  }, []);

  const fetchLiveGoogleSheet = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('https://docs.google.com/spreadsheets/d/11GP8ylFH5VLhSD2tBw_7iUyKy9trzDY4kATMpYPspbw/export?format=csv');
      if (res.ok) {
        const text = await res.text();
        const parsed = parseGoogleSheetCsv(text);
        if (parsed.length > 0) {
          setPendingCandidates(parsed);
        }
      }
    } catch (e) {
      console.log('Error fetching sheet', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const addMember = async (candidate: CandidateMember) => {
    const key = candidate.enrollmentNo || candidate.email || candidate.id;
    const newMember: CandidateMember = {
      ...candidate,
      disciplineScore: 100,
      status: 'Active',
    };
    
    // Save to Supabase
    await supabase.from('active_members').insert({
      id: newMember.id,
      name: newMember.name,
      contact_no: newMember.contactNo,
      email: newMember.email,
      dob: newMember.dob,
      photo_url: newMember.photoUrl,
      course: newMember.course,
      current_year: newMember.currentYear,
      section: newMember.section,
      enrollment_no: newMember.enrollmentNo,
      domains_interest: newMember.domainsInterest,
      ri_membership_id: newMember.riMembershipId,
      designation: newMember.designation,
      bio: newMember.bio,
      discipline_score: newMember.disciplineScore,
      status: newMember.status
    });

    setActiveMembers(prev => {
      if (prev.some(m => (m.enrollmentNo && m.enrollmentNo === candidate.enrollmentNo) || m.id === candidate.id)) return prev;
      return [newMember, ...prev];
    });
    setAddedMemberKeys(prev => new Set(prev).add(key));

    // Auto-log Fee
    const newTx: Transaction = {
      id: `T-DUE-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      description: `Membership Fee – ${candidate.name} (${candidate.enrollmentNo})`,
      category: 'Dues',
      type: 'income',
      amount: 1200,
      receipt: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      verifiedBy: 'System Auto-Onboard',
    };
    
    await supabase.from('transactions').insert({
      id: newTx.id, date: newTx.date, description: newTx.description, category: newTx.category, type: newTx.type, amount: newTx.amount, receipt: newTx.receipt, verified_by: newTx.verifiedBy
    });
    setTransactions(prev => [newTx, ...prev]);
  };

  const removeMember = async (memberId: string) => {
    const memberToRemove = activeMembers.find(m => m.id === memberId);
    if (!memberToRemove) return;

    await supabase.from('active_members').delete().eq('id', memberId);

    setActiveMembers(prev => prev.filter(m => m.id !== memberId));
    setAddedMemberKeys(prev => {
      const next = new Set(prev);
      next.delete(memberToRemove.enrollmentNo || memberToRemove.email || memberToRemove.id);
      return next;
    });

    // Auto-log Refund
    const refundTx: Transaction = {
      id: `T-ADJ-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      description: `Membership Departure Adjustment – ${memberToRemove.name}`,
      category: 'Dues Adjustment',
      type: 'expense',
      amount: 1200,
      receipt: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      verifiedBy: 'System Auto-Adjustment',
    };

    await supabase.from('transactions').insert({
      id: refundTx.id, date: refundTx.date, description: refundTx.description, category: refundTx.category, type: refundTx.type, amount: refundTx.amount, receipt: refundTx.receipt, verified_by: refundTx.verifiedBy
    });
    setTransactions(prev => [refundTx, ...prev]);
  };

  const deleteCandidate = (candidateId: string) => {
    setPendingCandidates(prev => prev.filter(c => c.id !== candidateId));
  };

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'receipt' | 'verifiedBy'> & { verifiedBy?: string }) => {
    const newTx: Transaction = {
      ...tx,
      id: `T-${Date.now()}`,
      receipt: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      verifiedBy: tx.verifiedBy || 'Treasury Admin',
    };
    
    await supabase.from('transactions').insert({
      id: newTx.id, date: newTx.date, description: newTx.description, category: newTx.category, type: newTx.type, amount: newTx.amount, receipt: newTx.receipt, verified_by: newTx.verifiedBy
    });
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = async (txId: string) => {
    await supabase.from('transactions').delete().eq('id', txId);
    setTransactions(prev => prev.filter(t => t.id !== txId));
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    const newSettings = { ...appSettings, ...updates };
    
    await supabase.from('app_settings').update({
      show_board_of_directors: newSettings.showBoardOfDirectors,
      welcome_text: newSettings.welcomeText,
      hero_banner_url: newSettings.heroBannerUrl,
      board_of_directors: newSettings.boardOfDirectors
    }).eq('id', 1);

    setAppSettings(newSettings);
  };

  const addEvent = async (event: Omit<RotaractEvent, 'id' | 'status' | 'nominatedMemberIds'>) => {
    const newEvent: RotaractEvent = {
      ...event,
      id: `EVT-${Date.now()}`,
      status: 'pending_approval',
      nominatedMemberIds: [],
    };

    // Try inserting into Supabase, ignoring new columns if they don't exist yet
    try {
      await supabase.from('events').insert({
        id: newEvent.id, name: newEvent.name, avenue: newEvent.avenue, date: newEvent.date, start_time: newEvent.startTime, end_time: newEvent.endTime, venue: newEvent.venue, about: newEvent.about, status: newEvent.status, nominated_member_ids: newEvent.nominatedMemberIds, poster_url: newEvent.posterUrl, form_link: newEvent.formLink, public_status: newEvent.publicStatus, is_public: newEvent.isPublic
      });
    } catch (e) {
      console.warn('Supabase insert failed, likely due to missing columns. Continuing with local state.');
    }
    setEvents(prev => [newEvent, ...prev]);
  };

  const updateEvent = async (eventId: string, updates: Partial<RotaractEvent>) => {
    const current = events.find(e => e.id === eventId);
    if (!current) return;
    const newEvent = { ...current, ...updates };
    
    try {
      await supabase.from('events').update({
        name: newEvent.name, avenue: newEvent.avenue, date: newEvent.date, start_time: newEvent.startTime, end_time: newEvent.endTime, venue: newEvent.venue, about: newEvent.about, status: newEvent.status, actual_date: newEvent.actualDate, actual_time: newEvent.actualTime, actual_duration_hours: newEvent.actualDurationHours, beneficiaries: newEvent.beneficiaries, nominated_member_ids: newEvent.nominatedMemberIds, poster_url: newEvent.posterUrl, form_link: newEvent.formLink, public_status: newEvent.publicStatus, is_public: newEvent.isPublic
      }).eq('id', eventId);
    } catch (e) {
      console.warn('Supabase update failed. Continuing with local state.');
    }
    
    setEvents(prev => prev.map(e => e.id === eventId ? newEvent : e));
  };

  const deleteEvent = async (eventId: string) => {
    await supabase.from('events').delete().eq('id', eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const uploadEventReport = async (eventId: string, pdfDataUrl: string) => {
    const uploadedAt = new Date().toISOString();
    await supabase.from('event_reports').upsert({ event_id: eventId, pdf_data_url: pdfDataUrl, uploaded_at: uploadedAt });
    const report = { eventId, pdfDataUrl, uploadedAt };
    setEventReports(prev => [...prev.filter(r => r.eventId !== eventId), report]);
  };

  const uploadMonthlyReport = async (monthKey: string, pdfDataUrl: string) => {
    const uploadedAt = new Date().toISOString();
    await supabase.from('monthly_reports').upsert({ month_key: monthKey, pdf_data_url: pdfDataUrl, uploaded_at: uploadedAt });
    const report = { monthKey, pdfDataUrl, uploadedAt };
    setMonthlyReports(prev => [...prev.filter(r => r.monthKey !== monthKey), report]);
  };

  return (
    <AppContext.Provider
      value={{
        activeMembers, pendingCandidates, addedMemberKeys, isSyncing, addMember, removeMember, deleteCandidate, fetchLiveGoogleSheet,
        transactions, addTransaction, deleteTransaction,
        appSettings, updateSettings,
        events, addEvent, updateEvent, deleteEvent,
        eventReports, monthlyReports, uploadEventReport, uploadMonthlyReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
