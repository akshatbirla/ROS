-- ============================================================================
-- ROTARACT CLUB OF ACROPOLIS ROYALS (RID 3040)
-- COMPLETE PRODUCTION DATABASE SCHEMA & INITIAL DATA SEED
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. APP SETTINGS & HOMEPAGE CONFIGURATION
CREATE TABLE IF NOT EXISTS club_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_rotary_year',
    welcome_text TEXT NOT NULL DEFAULT 'शुद्धं शुभं सशक्तम् - CREATING IMPACT THROUGH INTEGRITY',
    hero_banner_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=2000&q=80',
    president_image TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    president_name TEXT DEFAULT 'Rtr. Shuddha Kaushik',
    president_year TEXT DEFAULT 'RY 2026 - 27',
    president_vision TEXT DEFAULT 'To build a Rotaract Club where integrity guides every decision, service creates lasting impact, sustainability becomes a way of life, and every member discovers the leader within themselves. Together, we will not just organize projects—we will transform lives, inspire change, and leave behind a legacy that truly matters.',
    who_we_are_text TEXT DEFAULT 'We are a community of young leaders driven by the Rotary motto of "Service Above Self". The Rotaract Club of Acropolis Royals is dedicated to creating positive change, fostering fellowship, and developing professional skills among our members.\n\nThrough various avenues of service, we impact lives, build sustainable solutions, and empower the next generation of changemakers. Join us in our journey of making the world a better place, one project at a time.',
    who_we_are_images TEXT[] DEFAULT ARRAY[
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
    ],
    gallery_drive_link TEXT DEFAULT 'https://drive.google.com',
    show_board_of_directors BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial settings row
INSERT INTO club_settings (id) VALUES ('current_rotary_year') ON CONFLICT (id) DO NOTHING;

-- 2. BOARD OF DIRECTORS (COUNCIL)
CREATE TABLE IF NOT EXISTS board_of_directors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avenue TEXT NOT NULL,
    image TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial BOD
INSERT INTO board_of_directors (name, role, avenue, image, display_order) VALUES
('Rtr. Akshat Sharma', 'President', 'Executive Board', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 1),
('Rtr. Priya Verma', 'Club Secretary', 'Executive Board', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 2),
('Rtr. Rohan Mehta', 'Vice President', 'Executive Board', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 3),
('Rtr. Ananya Joshi', 'Treasurer', 'Executive Board', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 4),
('Rtr. Devansh Saxena', 'Director - Club Service', 'Club Service', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 5),
('Rtr. Ishita Gupta', 'Director - Community Service', 'Community Service', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 6),
('Rtr. Kshitij Nair', 'Director - Professional Development', 'Professional Dev', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 7),
('Rtr. Sanya Malhotra', 'Director - International Service', 'International Service', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 8)
ON CONFLICT DO NOTHING;

-- 3. FLAGSHIP CAUSES
CREATE TABLE IF NOT EXISTS flagship_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    short_desc TEXT NOT NULL,
    about_story TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    accent_color TEXT DEFAULT 'from-amber-500/80',
    gallery TEXT[] DEFAULT '{}',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO flagship_projects (id, title, slug, short_desc, about_story, cover_image, accent_color, gallery, display_order) VALUES
('paws', 'Paws and Claws', 'paws-and-claws', 'Animal welfare initiative focused on feeding, vaccinating, and sheltering stray dogs and cats.', 'Paws and Claws is our dedicated animal welfare initiative. We organize regular feeding drives, coordinate with local vets for vaccination camps, and find loving homes for strays.', 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80', 'from-amber-500/80', ARRAY['https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80'], 1),
('readers', 'Readers Round Table', 'readers-round-table', 'Literacy and book donation campaign building mini-libraries in underprivileged primary schools.', 'Readers Round Table brings the joy of reading to underprivileged children. We collect books, build cozy reading corners in government schools, and conduct storytelling workshops.', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', 'from-rose-500/80', ARRAY['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'], 2),
('nayi-disha', 'Nayi Disha', 'nayi-disha', 'Skill development and vocational workshops empowering youth with digital and craft skills.', 'Nayi Disha empowers young minds from marginalized backgrounds with vocational skills like computer basics, resume writing, and soft skills to make them employment-ready.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', 'from-blue-500/80', ARRAY['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'], 3),
('pathshala', 'Pathshala', 'pathshala', 'Sunday remedial education and life-skills mentoring for children living in slum clusters.', 'Pathshala is our weekly weekend teaching initiative where members visit local communities to teach English, Mathematics, and creative arts, fostering curious and confident learners.', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80', 'from-emerald-500/80', ARRAY['https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80'], 4)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  short_desc = EXCLUDED.short_desc,
  about_story = EXCLUDED.about_story;

-- 4. PHOTO GALLERY & FEATURED ALBUMS
CREATE TABLE IF NOT EXISTS photo_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO photo_gallery (event_name, image_url) VALUES
('Installation Ceremony 2026', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'),
('Mega Blood Donation Camp', 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80'),
('Paws & Claws Drive', 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'),
('District Youth Conference', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80'),
('Pathshala Weekend Drive', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'),
('Tree Plantation Mission', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS featured_albums (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    description TEXT,
    photos TEXT[] DEFAULT '{}',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO featured_albums (id, title, cover_image, description, photos, display_order) VALUES
('a1', 'District Conference 2026', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80', 'The flagship assembly of District 3040 celebrating leadership milestones, awards, and regional fellowship.', ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'], 1),
('a2', 'Annual Installation Ceremony', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', 'Formal pinning of the Board of Directors and commencement of the Rotary Year 2026-27 journey.', ARRAY['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'], 2),
('a3', 'Rotary Youth Leadership Awards (RYLA)', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80', 'Three-day intensive residential bootcamp honing crisis navigation, decision making, and community problem-solving.', ARRAY['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'], 3),
('a4', 'Rural Community Outreach', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80', 'Comprehensive health check-up camps, sanitation hygiene kits, and winter warmth distribution drives.', ARRAY['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'], 4)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 5. MEMBERS DIRECTORY
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    rotary_id TEXT UNIQUE,
    email TEXT,
    contact_no TEXT,
    college_enrollment TEXT,
    blood_group TEXT,
    avenue TEXT NOT NULL DEFAULT 'Club Service',
    role TEXT NOT NULL DEFAULT 'Member',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('candidate', 'active', 'alumni', 'probation')),
    discipline_score INT DEFAULT 100 CHECK (discipline_score BETWEEN 0 AND 100),
    joining_date DATE DEFAULT CURRENT_DATE,
    dues_settled BOOLEAN DEFAULT false,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO members (full_name, rotary_id, email, contact_no, avenue, role, status, discipline_score, dues_settled) VALUES
('Rtr. Akshat Sharma', 'RAC-2026-001', 'president@acropolisroyals.org', '+91 98765 43210', 'Executive Board', 'President', 'active', 100, true),
('Rtr. Priya Verma', 'RAC-2026-002', 'secretary@acropolisroyals.org', '+91 98765 43211', 'Executive Board', 'Club Secretary', 'active', 98, true),
('Rtr. Rohan Mehta', 'RAC-2026-003', 'rohan@acropolisroyals.org', '+91 98765 43212', 'Executive Board', 'Vice President', 'active', 95, true),
('Rtr. Ananya Joshi', 'RAC-2026-004', 'treasurer@acropolisroyals.org', '+91 98765 43213', 'Executive Board', 'Treasurer', 'active', 100, true),
('Rtr. Devansh Saxena', 'RAC-2026-005', 'devansh@acropolisroyals.org', '+91 98765 43214', 'Club Service', 'Director', 'active', 92, true)
ON CONFLICT (rotary_id) DO NOTHING;

-- 6. EVENTS ARCHIVE & INITIATIVES
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    avenue TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TEXT,
    venue TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'In Planning' CHECK (status IN ('In Planning', 'Scheduled', 'Approved', 'happened', 'Rejected')),
    description TEXT,
    beneficiaries INT DEFAULT 0,
    actual_duration_hours NUMERIC(4,2) DEFAULT 2.0,
    allocated_budget NUMERIC(10,2) DEFAULT 0.0,
    actual_expenditure NUMERIC(10,2) DEFAULT 0.0,
    cover_image TEXT,
    nominated_member_ids UUID[] DEFAULT '{}',
    lead_chair_name TEXT,
    lead_chair_contact TEXT,
    pdf_report_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO events (title, avenue, start_date, venue, status, beneficiaries, actual_duration_hours, allocated_budget, actual_expenditure, cover_image, description) VALUES
('Mega Blood Donation Camp 2026', 'Community Service', '2026-02-15', 'Acropolis Auditorium, Campus', 'happened', 280, 6.0, 15000.00, 14200.00, 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80', 'Flagship district blood drive in association with M.Y. Hospital Blood Bank.'),
('Paws & Claws Vaccination Camp', 'Community Service', '2026-03-01', 'Bhawarkua Animal Center', 'happened', 95, 4.0, 8000.00, 7500.00, 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80', 'Anti-rabies vaccination and nutrient feeding drive for over 90 stray animals.'),
('Professional Resume & Mock Interview Bootcamp', 'Professional Dev', '2026-03-20', 'Seminar Hall 2, AITR', 'happened', 160, 5.0, 5000.00, 4800.00, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', 'Corporate mentors conducted live mock interviews and resume reviews for 3rd and 4th year students.'),
('International Sister Club Fellowship Meet', 'International Service', '2026-04-10', 'Zoom Virtual Conference', 'happened', 65, 2.5, 0.00, 0.00, 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', 'Joint bilateral dialogue with Rotaract Club of Colombo Central, Sri Lanka.')
ON CONFLICT DO NOTHING;

-- 7. MEETINGS & MINUTES OF MEETING (MOM) ARCHIVE
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_no TEXT,
    meeting_title TEXT NOT NULL,
    meeting_type TEXT NOT NULL CHECK (meeting_type IN ('GBM', 'GM')),
    calling_authority TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TEXT NOT NULL,
    venue TEXT,
    virtual_link TEXT,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    mom_text TEXT,
    mom_filed_by TEXT,
    mom_filed_at TIMESTAMPTZ,
    attendee_member_ids UUID[] DEFAULT '{}',
    meeting_dossier_pdf TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO meetings (meeting_title, meeting_type, calling_authority, scheduled_date, scheduled_time, venue, status, mom_text, mom_filed_by, mom_filed_at) VALUES
('General Board Meeting 01: Rotary Year Launch', 'GBM', 'President', '2026-07-05', '11:00 AM', 'Board Room A, Acropolis', 'Completed', 'The Board deliberated on the annual calendar, finalized Avenue Director targets, and approved the initial project roadmap. Quorum verified with 8 of 8 officers present.', 'Rtr. Priya Verma (Secretary)', NOW()),
('General Meeting 01: New Member Orientation', 'GM', 'Secretary', '2026-07-20', '02:00 PM', 'Auditorium 1', 'Completed', 'Introduced new inductees to the Four-Way Test, briefed them on Avenue structures, and collected membership registration forms.', 'Rtr. Priya Verma (Secretary)', NOW()),
('General Board Meeting 02: Mid-Semester Review', 'GBM', 'President', '2026-10-12', '10:30 AM', 'Virtual Google Meet', 'Completed', 'Reviewed financials with Treasurer. Treasury verified in surplus. Approved budgets for Paws & Claws and Pathshala winter drives.', 'Rtr. Priya Verma (Secretary)', NOW())
ON CONFLICT DO NOTHING;

-- 8. TREASURY & FINANCIAL TRANSACTIONS
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(10,2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    verified_by TEXT NOT NULL,
    payment_mode TEXT DEFAULT 'Online/UPI',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO financial_transactions (type, amount, category, description, date, verified_by, payment_mode) VALUES
('income', 48000.00, 'Membership Dues', 'Annual membership dues collected from 40 inducted members', '2026-07-25', 'Rtr. Ananya Joshi (Treasurer)', 'Bank Transfer'),
('income', 25000.00, 'Sponsorship', 'CSR grant received for Pathshala underprivileged schooling kits', '2026-08-10', 'Rtr. Akshat Sharma (President)', 'UPI/Cheque'),
('expense', 14200.00, 'Community Service', 'Procurement of refreshments, medical supplies and donor pins for Blood Camp', '2026-02-15', 'Rtr. Ananya Joshi (Treasurer)', 'UPI'),
('expense', 7500.00, 'Community Service', 'Vaccines and pedigree feed sacks for Paws & Claws campaign', '2026-03-01', 'Rtr. Ananya Joshi (Treasurer)', 'Cash Voucher')
ON CONFLICT DO NOTHING;

-- 9. EXTERNAL ROSTER & DISTRICT DIRECTORY
CREATE TABLE IF NOT EXISTS external_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('district_officials', 'faculty_advisors', 'past_presidents', 'rotary_sponsors')),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    organization TEXT DEFAULT 'Rotary District 3040',
    contact_phone TEXT,
    email TEXT,
    notes TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO external_contacts (category, name, designation, organization, contact_phone, email, notes) VALUES
('district_officials', 'Rtr. Harshit Jain', 'District Rotaract Representative (DRR)', 'Rotary International District 3040', '+91 99887 76655', 'drr@rotaract3040.org', 'Direct liaison for official district reporting dossiers and official visit schedules.'),
('district_officials', 'Rtr. Sneha Solanki', 'District General Secretary', 'Rotary International District 3040', '+91 98223 34455', 'dgs@rotaract3040.org', 'In charge of quarterly district project filings.'),
('faculty_advisors', 'Dr. S. C. Sharma', 'Faculty Coordinator & Dean of Student Affairs', 'Acropolis Institute of Technology and Research', '+91 94250 11223', 'scsharma@acropolis.in', 'Institutional approvals, auditorium booking, and on-campus event permissions.'),
('past_presidents', 'Rtr. Aman Kashyap', 'Immediate Past President (IPP)', 'Rotaract Club of Acropolis Royals', '+91 98930 44556', 'aman.k@alumni.acropolisroyals.org', 'Advisor to current Board of Directors.')
ON CONFLICT DO NOTHING;

-- 10. REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE club_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE board_of_directors;
ALTER PUBLICATION supabase_realtime ADD TABLE flagship_projects;
ALTER PUBLICATION supabase_realtime ADD TABLE photo_gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE featured_albums;
ALTER PUBLICATION supabase_realtime ADD TABLE members;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE external_contacts;

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE club_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_of_directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagship_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_contacts ENABLE ROW LEVEL SECURITY;

-- Allow universal read (public website visibility)
CREATE POLICY "Public read club_settings" ON club_settings FOR SELECT USING (true);
CREATE POLICY "Public read board_of_directors" ON board_of_directors FOR SELECT USING (true);
CREATE POLICY "Public read flagship_projects" ON flagship_projects FOR SELECT USING (true);
CREATE POLICY "Public read photo_gallery" ON photo_gallery FOR SELECT USING (true);
CREATE POLICY "Public read featured_albums" ON featured_albums FOR SELECT USING (true);
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read meetings" ON meetings FOR SELECT USING (true);
CREATE POLICY "Public read financial_transactions" ON financial_transactions FOR SELECT USING (true);
CREATE POLICY "Public read external_contacts" ON external_contacts FOR SELECT USING (true);

-- Allow full write for app users / admin mutations
CREATE POLICY "Allow write club_settings" ON club_settings FOR ALL USING (true);
CREATE POLICY "Allow write board_of_directors" ON board_of_directors FOR ALL USING (true);
CREATE POLICY "Allow write flagship_projects" ON flagship_projects FOR ALL USING (true);
CREATE POLICY "Allow write photo_gallery" ON photo_gallery FOR ALL USING (true);
CREATE POLICY "Allow write featured_albums" ON featured_albums FOR ALL USING (true);
CREATE POLICY "Allow write members" ON members FOR ALL USING (true);
CREATE POLICY "Allow write events" ON events FOR ALL USING (true);
CREATE POLICY "Allow write meetings" ON meetings FOR ALL USING (true);
CREATE POLICY "Allow write financial_transactions" ON financial_transactions FOR ALL USING (true);
CREATE POLICY "Allow write external_contacts" ON external_contacts FOR ALL USING (true);

