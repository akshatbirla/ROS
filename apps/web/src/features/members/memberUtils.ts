const DEFAULT_AVATAR = '/default-avatar.png';

/** Convert Google Drive share URL to a direct image URL usable in <img> tags */
export const getDirectImageUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return DEFAULT_AVATAR;
  const cleanUrl = url.trim();
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    const match = cleanUrl.match(/id=([a-zA-Z0-9_-]+)/) || cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return cleanUrl.startsWith('http') || cleanUrl.startsWith('/') ? cleanUrl : DEFAULT_AVATAR;
};

export { DEFAULT_AVATAR };

export interface CandidateMember {
  id: string;
  name: string;
  contactNo: string;
  email: string;
  dob: string;
  photoUrl: string;
  course: string;
  currentYear: string;
  section: string;
  enrollmentNo: string;
  domainsInterest: string;
  riMembershipId: string;
  designation: string;
  bio?: string;
  disciplineScore?: number;
  status?: 'Active' | 'Alumni' | 'Inactive';
}

/** Robust CSV parser handling multi-line quoted fields & dynamic header indexing */
export const parseGoogleSheetCsv = (csvText: string): CandidateMember[] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim());
      if (currentRow.some(f => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const header = rows[0].map(h => h.toLowerCase());
  const findCol = (keywords: string[]) => header.findIndex(h => keywords.some(k => h.includes(k)));

  const nameIdx    = findCol(['name of the candidate', 'candidate name']);
  const contactIdx  = findCol(['contact no', 'mobile', 'phone']);
  const emailIdx    = findCol(['e-mail id', 'email']);
  const dobIdx      = findCol(['date of birth', 'dob']);
  const photoIdx    = findCol(['upload a professional photo', 'photo', 'drive']);
  const courseIdx   = findCol(['course']);
  const yearIdx     = findCol(['current year', 'year']);
  const sectionIdx  = findCol(['section']);
  const enrollIdx   = findCol(['enrollment number', 'scholar no', 'enrollment']);
  const domainIdx   = findCol(['domains interest', 'domains', 'which domains']);
  const bioIdx      = findCol(['tell us something about yourself', 'why do you want to join']);
  // NEW: Live-synced from sheet
  const riIdx       = findCol(['ri membership id', 'rotaract id', 'ri membership', 'membership id']);
  const designIdx   = findCol(['designation']);

  const candidates: CandidateMember[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    const name = (nameIdx !== -1 && row[nameIdx]) ? row[nameIdx] : (row[2] || row[1] || 'Candidate');
    if (!name || name.length <= 1 || name.toLowerCase().includes('email address') || name.toLowerCase().includes('candidate')) continue;

    const contactNo = (contactIdx !== -1 && row[contactIdx]) ? row[contactIdx] : (row[3] || '');
    const email = (emailIdx !== -1 && row[emailIdx]) ? row[emailIdx] : (row[4] || row[1] || '');
    const dob = (dobIdx !== -1 && row[dobIdx]) ? row[dobIdx] : (row[5] || '');
    const rawPhotoUrl = (photoIdx !== -1 && row[photoIdx]) ? row[photoIdx] : (row[6] || '');
    const course = (courseIdx !== -1 && row[courseIdx]) ? row[courseIdx] : (row[7] || 'B.Tech');
    const currentYear = (yearIdx !== -1 && row[yearIdx]) ? row[yearIdx] : (row[8] || 'I');
    const section = (sectionIdx !== -1 && row[sectionIdx]) ? row[sectionIdx] : (row[9] || 'A');
    const enrollmentNo = (enrollIdx !== -1 && row[enrollIdx]) ? row[enrollIdx] : (row[10] || 'PENDING');
    const domainsInterest = (domainIdx !== -1 && row[domainIdx]) ? row[domainIdx] : (row[12] || 'Community Service, Event Management');
    const bio = (bioIdx !== -1 && row[bioIdx]) ? row[bioIdx] : (row[13] || row[11] || '');

    // Fetch RI Membership ID and Designation from live sheet columns
    const rawRiId      = (riIdx !== -1 && row[riIdx])     ? row[riIdx].trim()     : '';
    const rawDesignation = (designIdx !== -1 && row[designIdx]) ? row[designIdx].trim() : '';

    const riMembershipId = rawRiId || 'Pending';
    // Normalise: if sheet says empty or 'member' treat as Member; else keep the exact designation
    const designation = rawDesignation && rawDesignation.toLowerCase() !== 'member'
      ? rawDesignation
      : (rawDesignation || 'Member');

    candidates.push({
      id: `sheet-${i}-${Date.now()}`,
      name,
      contactNo,
      email,
      dob,
      photoUrl: getDirectImageUrl(rawPhotoUrl),
      course,
      currentYear,
      section,
      enrollmentNo,
      domainsInterest: domainsInterest || 'Public Relations, Event Management',
      riMembershipId,
      designation,
      bio,
    });
  }

  return candidates;
};
