import React, { createContext, useContext, useState, useEffect } from 'react';
import { CandidateMember, parseGoogleSheetCsv } from '../features/members/memberUtils';
import { supabase } from '../lib/supabaseClient';
import { databaseService } from '../services/databaseService';

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
    flagshipProjects: [],
    photoGallery: [],
    featuredAlbums: [],
    boardOfDirectors: []
  });

  const [events, setEvents] = useState<RotaractEvent[]>([]);
  const [eventReports, setEventReports] = useState<EventReport[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);

  // Function to load all production data from Supabase tables
  const loadDatabaseData = async () => {
    try {
      // 1. Settings
      const settingsData = await databaseService.fetchSettings();
      // 2. BOD
      const bodData = await databaseService.fetchBoard();
      // 3. Flagship Projects
      const flagshipData = await databaseService.fetchFlagshipProjects();
      // 4. Photo Gallery
      const galleryData = await databaseService.fetchGallery();
      // 5. Featured Albums
      const albumsData = await databaseService.fetchFeaturedAlbums();

      setAppSettings(prev => ({
        ...prev,
        welcomeText: settingsData?.welcome_text || prev.welcomeText,
        heroBannerUrl: settingsData?.hero_banner_url || prev.heroBannerUrl,
        presidentImage: settingsData?.president_image || prev.presidentImage,
        whoWeAreText: settingsData?.who_we_are_text || prev.whoWeAreText,
        whoWeAreImages: settingsData?.who_we_are_images || prev.whoWeAreImages,
        galleryDriveLink: settingsData?.gallery_drive_link || prev.galleryDriveLink,
        showBoardOfDirectors: settingsData?.show_board_of_directors ?? prev.showBoardOfDirectors,
        boardOfDirectors: bodData.length > 0 ? bodData.map(b => ({
          id: b.id,
          name: b.name,
          role: b.role,
          avenue: b.avenue,
          image: b.image || ''
        })) : prev.boardOfDirectors,
        flagshipProjects: flagshipData.length > 0 ? flagshipData.map(f => ({
          id: f.id,
          title: f.title,
          desc: f.short_desc,
          about: f.about_story,
          img: f.cover_image,
          color: f.accent_color || 'from-amber-500/80',
          gallery: f.gallery || []
        })) : prev.flagshipProjects,
        photoGallery: galleryData.length > 0 ? galleryData.map(g => ({
          id: g.id,
          img: g.image_url,
          eventName: g.event_name
        })) : prev.photoGallery,
        featuredAlbums: albumsData.length > 0 ? albumsData.map(a => ({
          id: a.id,
          title: a.title,
          image: a.cover_image,
          description: a.description || '',
          photos: a.photos || []
        })) : prev.featuredAlbums
      }));

      // 6. Members
      const membersData = await databaseService.fetchMembers();
      if (membersData.length > 0) {
        const mappedMembers: CandidateMember[] = membersData.map(m => ({
          id: m.id,
          name: m.full_name,
          contactNo: m.contact_no || '',
          email: m.email || '',
          dob: '',
          photoUrl: m.avatar_url || '',
          course: '',
          currentYear: '',
          section: '',
          enrollmentNo: m.college_enrollment || m.rotary_id || '',
          domainsInterest: m.avenue,
          riMembershipId: m.rotary_id || '',
          designation: m.role,
          disciplineScore: m.discipline_score,
          status: m.status === 'active' ? 'Active' : 'Inactive'
        }));
        setActiveMembers(mappedMembers);
        setAddedMemberKeys(new Set(mappedMembers.map(m => m.enrollmentNo || m.email || m.id)));
      }

      // 7. Events
      const eventsData = await databaseService.fetchEvents();
      if (eventsData.length > 0) {
        setEvents(eventsData.map(e => ({
          id: e.id,
          name: e.title,
          avenue: e.avenue,
          date: e.start_date,
          startTime: e.start_time || '10:00 AM',
          endTime: '01:00 PM',
          venue: e.venue,
          about: e.description || '',
          status: e.status === 'happened' ? 'happened' : e.status === 'Approved' ? 'approved' : 'pending_approval',
          actualDate: e.start_date,
          actualTime: e.start_time || '10:00 AM',
          actualDurationHours: Number(e.actual_duration_hours || 2),
          beneficiaries: Number(e.beneficiaries || 0),
          nominatedMemberIds: (e.nominated_member_ids as any) || [],
          posterUrl: e.cover_image || '',
          formLink: '',
          publicStatus: e.status === 'happened' ? 'Completed' : 'Upcoming',
          isPublic: true,
          likes: 0,
          shares: 0
        })));
      }

      // 8. Transactions
      const txData = await databaseService.fetchTransactions();
      if (txData.length > 0) {
        setTransactions(txData.map(t => ({
          id: t.id,
          date: t.date,
          description: t.description,
          category: t.category,
          type: t.type,
          amount: Number(t.amount),
          receipt: t.receipt_url || `RCP-${t.id.slice(0, 4)}`,
          verifiedBy: t.verified_by
        })));
      }
    } catch (err) {
      console.error("Error loading data from Supabase:", err);
    }
  };

  useEffect(() => {
    loadDatabaseData();
    fetchLiveGoogleSheet();

    // --------------------------------------------------------------------------
    // Supabase Real-Time Subscriptions for instantaneous sync across all tabs
    // --------------------------------------------------------------------------
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'club_settings' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'board_of_directors' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flagship_projects' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photo_gallery' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'featured_albums' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        loadDatabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_transactions' }, () => {
        loadDatabaseData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    
    // Save to Supabase
    await databaseService.addMember({
      full_name: candidate.name,
      contact_no: candidate.contactNo,
      email: candidate.email,
      college_enrollment: candidate.enrollmentNo,
      avenue: candidate.domainsInterest || 'Club Service',
      role: candidate.designation || 'Member',
      status: 'active',
      discipline_score: 100,
      dues_settled: true,
      avatar_url: candidate.photoUrl
    });

    // Auto-log Fee Transaction
    await databaseService.addTransaction({
      type: 'income',
      amount: 1200,
      category: 'Dues',
      description: `Membership Fee – ${candidate.name} (${candidate.enrollmentNo})`,
      date: new Date().toISOString().split('T')[0],
      verified_by: 'System Auto-Onboard',
      payment_mode: 'Online/UPI'
    });

    loadDatabaseData();
  };

  const removeMember = async (memberId: string) => {
    const memberToRemove = activeMembers.find(m => m.id === memberId);
    if (!memberToRemove) return;

    await databaseService.deleteMember(memberId);

    // Auto-log Refund
    await databaseService.addTransaction({
      type: 'expense',
      amount: 1200,
      category: 'Dues Adjustment',
      description: `Membership Departure Adjustment – ${memberToRemove.name}`,
      date: new Date().toISOString().split('T')[0],
      verified_by: 'System Auto-Adjustment',
      payment_mode: 'Online/UPI'
    });

    loadDatabaseData();
  };

  const deleteCandidate = (candidateId: string) => {
    setPendingCandidates(prev => prev.filter(c => c.id !== candidateId));
  };

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'receipt' | 'verifiedBy'> & { verifiedBy?: string }) => {
    await databaseService.addTransaction({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      date: tx.date || new Date().toISOString().split('T')[0],
      verified_by: tx.verifiedBy || 'Treasury Admin',
      payment_mode: 'Online/UPI'
    });
    loadDatabaseData();
  };

  const deleteTransaction = async (txId: string) => {
    await databaseService.deleteTransaction(txId);
    loadDatabaseData();
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    const newSettings = { ...appSettings, ...updates };
    setAppSettings(newSettings);

    // 1. Update Core Settings
    await databaseService.updateSettings({
      welcome_text: newSettings.welcomeText,
      hero_banner_url: newSettings.heroBannerUrl,
      president_image: newSettings.presidentImage,
      who_we_are_text: newSettings.whoWeAreText,
      who_we_are_images: newSettings.whoWeAreImages,
      gallery_drive_link: newSettings.galleryDriveLink,
      show_board_of_directors: newSettings.showBoardOfDirectors
    });

    // 2. Sync BOD if updated
    if (updates.boardOfDirectors) {
      await databaseService.syncBoard(updates.boardOfDirectors.map((b, idx) => ({
        id: b.id,
        name: b.name,
        role: b.role,
        avenue: b.avenue || 'Executive Board',
        image: b.image,
        display_order: idx + 1
      })));
    }

    // 3. Sync Flagship Projects if updated
    if (updates.flagshipProjects) {
      for (let i = 0; i < updates.flagshipProjects.length; i++) {
        const fp = updates.flagshipProjects[i];
        await databaseService.updateFlagshipProject({
          id: fp.id,
          title: fp.title,
          short_desc: fp.desc,
          about_story: fp.about,
          cover_image: fp.img,
          accent_color: fp.color,
          gallery: fp.gallery,
          display_order: i + 1
        });
      }
    }

    // 4. Sync Featured Albums if updated
    if (updates.featuredAlbums) {
      for (let i = 0; i < updates.featuredAlbums.length; i++) {
        const alb = updates.featuredAlbums[i];
        await databaseService.updateFeaturedAlbum({
          id: alb.id,
          title: alb.title,
          cover_image: alb.image,
          description: alb.description,
          photos: alb.photos || [],
          display_order: i + 1
        });
      }
    }
  };

  const addEvent = async (event: Omit<RotaractEvent, 'id' | 'status' | 'nominatedMemberIds'>) => {
    await databaseService.addEvent({
      title: event.name,
      avenue: event.avenue,
      start_date: event.date,
      start_time: event.startTime,
      venue: event.venue,
      status: 'In Planning',
      description: event.about,
      beneficiaries: 0,
      actual_duration_hours: 2,
      allocated_budget: 0,
      actual_expenditure: 0,
      cover_image: event.posterUrl
    });
    loadDatabaseData();
  };

  const updateEvent = async (eventId: string, updates: Partial<RotaractEvent>) => {
    const current = events.find(e => e.id === eventId);
    if (!current) return;
    const newEvent = { ...current, ...updates };

    await databaseService.updateEvent(eventId, {
      title: newEvent.name,
      avenue: newEvent.avenue,
      start_date: newEvent.date,
      start_time: newEvent.startTime,
      venue: newEvent.venue,
      status: newEvent.status === 'happened' ? 'happened' : newEvent.status === 'approved' ? 'Approved' : 'In Planning',
      description: newEvent.about,
      beneficiaries: newEvent.beneficiaries,
      actual_duration_hours: newEvent.actualDurationHours,
      cover_image: newEvent.posterUrl
    });
    loadDatabaseData();
  };

  const deleteEvent = async (eventId: string) => {
    await databaseService.deleteEvent(eventId);
    loadDatabaseData();
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
