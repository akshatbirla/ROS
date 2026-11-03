import { supabase } from '../lib/supabaseClient';

export interface ClubSettingsRecord {
  id: string;
  welcome_text: string;
  hero_banner_url: string;
  president_image: string | null;
  president_name: string;
  president_year: string;
  president_vision: string | null;
  who_we_are_text: string | null;
  who_we_are_images: string[];
  gallery_drive_link: string | null;
  show_board_of_directors: boolean;
  updated_at?: string;
}

export interface BoardMemberRecord {
  id: string;
  name: string;
  role: string;
  avenue: string;
  image: string | null;
  display_order: number;
}

export interface FlagshipProjectRecord {
  id: string;
  title: string;
  slug?: string;
  short_desc: string;
  about_story: string;
  cover_image: string;
  accent_color?: string;
  gallery: string[];
  display_order: number;
}

export interface PhotoGalleryRecord {
  id: string;
  event_name: string;
  image_url: string;
  caption?: string | null;
  date?: string;
  created_at?: string;
}

export interface FeaturedAlbumRecord {
  id: string;
  title: string;
  cover_image: string;
  description?: string | null;
  photos: string[];
  display_order: number;
}

export interface MemberRecord {
  id: string;
  full_name: string;
  rotary_id?: string | null;
  email?: string | null;
  contact_no?: string | null;
  college_enrollment?: string | null;
  blood_group?: string | null;
  avenue: string;
  role: string;
  status: 'candidate' | 'active' | 'alumni' | 'probation';
  discipline_score: number;
  joining_date?: string;
  dues_settled: boolean;
  avatar_url?: string | null;
}

export interface EventRecord {
  id: string;
  title: string;
  avenue: string;
  start_date: string;
  end_date?: string | null;
  start_time?: string | null;
  venue: string;
  status: 'In Planning' | 'Scheduled' | 'Approved' | 'happened' | 'Rejected';
  description?: string | null;
  beneficiaries: number;
  actual_duration_hours: number;
  allocated_budget: number;
  actual_expenditure: number;
  cover_image?: string | null;
  nominated_member_ids?: string[];
  lead_chair_name?: string | null;
  lead_chair_contact?: string | null;
  pdf_report_url?: string | null;
}

export interface MeetingRecord {
  id: string;
  meeting_no?: string | null;
  meeting_title: string;
  meeting_type: 'GBM' | 'GM';
  calling_authority: string;
  scheduled_date: string;
  scheduled_time: string;
  venue?: string | null;
  virtual_link?: string | null;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  mom_text?: string | null;
  mom_filed_by?: string | null;
  mom_filed_at?: string | null;
  attendee_member_ids?: string[];
  meeting_dossier_pdf?: string | null;
}

export interface TransactionRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt_url?: string | null;
  verified_by: string;
  payment_mode?: string;
}

export interface ExternalContactRecord {
  id: string;
  category: 'district_officials' | 'faculty_advisors' | 'past_presidents' | 'rotary_sponsors';
  name: string;
  designation: string;
  organization?: string;
  contact_phone?: string | null;
  email?: string | null;
  notes?: string | null;
  avatar_url?: string | null;
}

// ============================================================================
// SERVICE API METHODS
// ============================================================================

export const databaseService = {
  // --- Settings ---
  async fetchSettings(): Promise<ClubSettingsRecord | null> {
    const { data, error } = await supabase.from('club_settings').select('*').eq('id', 'current_rotary_year').single();
    if (error) {
      console.warn('Database fetchSettings warning:', error.message);
      return null;
    }
    return data;
  },

  async updateSettings(updates: Partial<ClubSettingsRecord>): Promise<ClubSettingsRecord | null> {
    const { data, error } = await supabase
      .from('club_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', 'current_rotary_year')
      .select()
      .single();
    if (error) console.error('Database updateSettings error:', error.message);
    return data;
  },

  // --- Board of Directors ---
  async fetchBoard(): Promise<BoardMemberRecord[]> {
    const { data, error } = await supabase.from('board_of_directors').select('*').order('display_order', { ascending: true });
    if (error) {
      console.warn('Database fetchBoard warning:', error.message);
      return [];
    }
    return data || [];
  },

  async syncBoard(members: BoardMemberRecord[]): Promise<void> {
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      await supabase.from('board_of_directors').upsert({
        id: m.id,
        name: m.name,
        role: m.role,
        avenue: m.avenue,
        image: m.image,
        display_order: i + 1,
        updated_at: new Date().toISOString()
      });
    }
  },

  // --- Flagship Causes ---
  async fetchFlagshipProjects(): Promise<FlagshipProjectRecord[]> {
    const { data, error } = await supabase.from('flagship_projects').select('*').order('display_order', { ascending: true });
    if (error) return [];
    return data || [];
  },

  async updateFlagshipProject(proj: FlagshipProjectRecord): Promise<void> {
    await supabase.from('flagship_projects').upsert({
      id: proj.id,
      title: proj.title,
      short_desc: proj.short_desc,
      about_story: proj.about_story,
      cover_image: proj.cover_image,
      gallery: proj.gallery,
      updated_at: new Date().toISOString()
    });
  },

  // --- Photo Gallery ---
  async fetchGallery(): Promise<PhotoGalleryRecord[]> {
    const { data, error } = await supabase.from('photo_gallery').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data || [];
  },

  async addGalleryPhoto(photo: Omit<PhotoGalleryRecord, 'id' | 'created_at'>): Promise<PhotoGalleryRecord | null> {
    const { data, error } = await supabase.from('photo_gallery').insert([photo]).select().single();
    if (error) console.error('addGalleryPhoto error:', error.message);
    return data;
  },

  async deleteGalleryPhoto(id: string): Promise<void> {
    await supabase.from('photo_gallery').delete().eq('id', id);
  },

  // --- Featured Albums ---
  async fetchFeaturedAlbums(): Promise<FeaturedAlbumRecord[]> {
    const { data, error } = await supabase.from('featured_albums').select('*').order('display_order', { ascending: true });
    if (error) return [];
    return data || [];
  },

  async updateFeaturedAlbum(album: FeaturedAlbumRecord): Promise<void> {
    await supabase.from('featured_albums').upsert({
      id: album.id,
      title: album.title,
      cover_image: album.cover_image,
      description: album.description,
      photos: album.photos,
      updated_at: new Date().toISOString()
    });
  },

  // --- Members & Candidates ---
  async fetchMembers(): Promise<MemberRecord[]> {
    const { data, error } = await supabase.from('members').select('*').order('full_name', { ascending: true });
    if (error) return [];
    return data || [];
  },

  async addMember(member: Omit<MemberRecord, 'id'>): Promise<MemberRecord | null> {
    const { data, error } = await supabase.from('members').insert([member]).select().single();
    return data;
  },

  async updateMember(id: string, updates: Partial<MemberRecord>): Promise<void> {
    await supabase.from('members').update(updates).eq('id', id);
  },

  async deleteMember(id: string): Promise<void> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
      await supabase.from('members').delete().eq('id', id);
    } else {
      await supabase.from('members').delete().or(`college_enrollment.eq.${id},rotary_id.eq.${id},email.eq.${id}`);
    }
  },

  // --- Events ---
  async fetchEvents(): Promise<EventRecord[]> {
    const { data, error } = await supabase.from('events').select('*').order('start_date', { ascending: false });
    if (error) return [];
    return data || [];
  },

  async addEvent(event: Omit<EventRecord, 'id'>): Promise<EventRecord | null> {
    const { data, error } = await supabase.from('events').insert([event]).select().single();
    return data;
  },

  async updateEvent(id: string, updates: Partial<EventRecord>): Promise<void> {
    await supabase.from('events').update(updates).eq('id', id);
  },

  async deleteEvent(id: string): Promise<void> {
    await supabase.from('events').delete().eq('id', id);
  },

  // --- Meetings & MOM ---
  async fetchMeetings(): Promise<MeetingRecord[]> {
    const { data, error } = await supabase.from('meetings').select('*').order('scheduled_date', { ascending: false });
    if (error) return [];
    return data || [];
  },

  async addMeeting(meeting: Omit<MeetingRecord, 'id'>): Promise<MeetingRecord | null> {
    const { data, error } = await supabase.from('meetings').insert([meeting]).select().single();
    return data;
  },

  async updateMeeting(id: string, updates: Partial<MeetingRecord>): Promise<void> {
    await supabase.from('meetings').update(updates).eq('id', id);
  },

  // --- Financial Transactions ---
  async fetchTransactions(): Promise<TransactionRecord[]> {
    const { data, error } = await supabase.from('financial_transactions').select('*').order('date', { ascending: false });
    if (error) return [];
    return data || [];
  },

  async addTransaction(tx: Omit<TransactionRecord, 'id'>): Promise<TransactionRecord | null> {
    const { data, error } = await supabase.from('financial_transactions').insert([tx]).select().single();
    return data;
  },

  async deleteTransaction(id: string): Promise<void> {
    await supabase.from('financial_transactions').delete().eq('id', id);
  },

  // --- External Directory ---
  async fetchExternalContacts(): Promise<ExternalContactRecord[]> {
    const { data, error } = await supabase.from('external_contacts').select('*').order('name', { ascending: true });
    if (error) return [];
    return data || [];
  },

  async addExternalContact(c: Omit<ExternalContactRecord, 'id'>): Promise<ExternalContactRecord | null> {
    const { data, error } = await supabase.from('external_contacts').insert([c]).select().single();
    return data;
  },

  async deleteExternalContact(id: string): Promise<void> {
    await supabase.from('external_contacts').delete().eq('id', id);
  }
};

