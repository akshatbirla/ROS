import React, { useState } from 'react';
import { Search, ShieldCheck, UserPlus, Mail, Phone, ExternalLink, Check, Trash2, X, RefreshCw, FileSpreadsheet, GraduationCap, Calendar, User, Eye, BookOpen, CreditCard, Users, Camera, Video, Globe, Palette, Heart, AlertTriangle, Download } from 'lucide-react';
import { CandidateMember, DEFAULT_AVATAR, getDirectImageUrl } from './memberUtils';
import { useApp } from '../../app/AppContext';

// Helper to get domain tag icon with distinct vibrant colors per domain
const getDomainIcon = (domainName: string) => {
  const name = domainName.toLowerCase();
  if (name.includes('relation') || name.includes('public')) return <Users className="w-4 h-4 text-[#E91E63]" />;
  if (name.includes('event')) return <Calendar className="w-4 h-4 text-[#F7A81B]" />;
  if (name.includes('photo')) return <Camera className="w-4 h-4 text-[#38BDF8]" />;
  if (name.includes('video')) return <Video className="w-4 h-4 text-[#E11D48]" />;
  if (name.includes('social') || name.includes('media')) return <Globe className="w-4 h-4 text-[#2DD4BF]" />;
  if (name.includes('design') || name.includes('creat')) return <Palette className="w-4 h-4 text-[#A855F7]" />;
  if (name.includes('community')) return <Heart className="w-4 h-4 text-[#EF4444]" />;
  return <ShieldCheck className="w-4 h-4 text-[#34D399]" />;
};

// ── Designation Badge Tier Logic ──────────────────────────────────────
const CORE_TEAM = [
  'president', 'vice president', 'secretary', 'joint secretary',
  'treasurer', 'sergeant-at-arms', 'sergeant at arms',
  'club learning facilitator', 'club student advisor',
];
const BOARD_OF_DIRECTORS = [
  'club service director', 'community service director',
  'international service director', 'vocational service director',
  'professional service director', 'membership director',
  'literacy chair', 'social media director',
];

type BadgeTier = 'green' | 'purple' | 'yellow';

const getDesignationTier = (designation: string): BadgeTier => {
  if (!designation) return 'green';
  const d = designation.toLowerCase().trim();
  if (d === 'member' || d === '') return 'green';
  // Check both directions: sheet value may be shorter or longer than our list entries
  if (CORE_TEAM.some(t => d.includes(t) || t.includes(d))) return 'purple';
  if (BOARD_OF_DIRECTORS.some(t => d.includes(t) || t.includes(d))) return 'yellow';
  // Keyword fallback: any 'director' or 'chair' role → yellow (Board of Directors)
  if (d.includes('director') || d.includes('chair') || d.includes('literacy')) return 'yellow';
  // Remaining non-member designations → purple (Core Team)
  return 'purple';
};

const BADGE_STYLES: Record<BadgeTier, { bg: string; border: string; iconColor: string; label: string }> = {
  green:  { bg: 'bg-black/35', border: 'border-emerald-400/30', iconColor: 'text-emerald-400', label: 'Member' },
  purple: { bg: 'bg-purple-950/60', border: 'border-purple-400/40', iconColor: 'text-purple-400', label: 'Core Team' },
  yellow: { bg: 'bg-amber-950/50', border: 'border-[#F7A81B]/40', iconColor: 'text-[#F7A81B]', label: 'Board of Directors' },
};
// Rank order for hierarchical sorting matching exact user specification
const DESIGNATION_RANKS: Record<string, number> = {
  'president': 1,
  'secretary': 2,
  'club student advisor': 3,
  'club learning facilitator': 4,
  'vice president': 5,
  'joint secretary': 6,
  'sergeant-at-arms': 7,
  'sergeant at arms': 7,
  'treasurer': 8,
  'literacy chair': 9,
  'international service director': 10,
  'community service director': 11,
  'club service director': 12,
  'vocational service director': 13,
  'professional service director': 14,
  'social media director': 15,
  'membership director': 16,
};

const getDesignationRank = (designation: string): number => {
  if (!designation) return 999;
  const d = designation.toLowerCase().trim();
  // Sort entries by key length descending so longer titles (e.g. 'vice president', 'joint secretary')
  // are checked BEFORE shorter substrings ('president', 'secretary')
  const sortedEntries = Object.entries(DESIGNATION_RANKS).sort((a, b) => b[0].length - a[0].length);

  for (const [key, rank] of sortedEntries) {
    if (d.includes(key)) return rank;
  }
  if (d.includes('director') || d.includes('chair')) return 20;
  return 999;
};

export const MembersPage: React.FC = () => {
  const {
    activeMembers,
    pendingCandidates,
    addedMemberKeys,
    addMember,
    removeMember,
    deleteCandidate,
    fetchLiveGoogleSheet,
    isSyncing,
  } = useApp();

  const [selectedMemberCard, setSelectedMemberCard] = useState<CandidateMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<CandidateMember | null>(null);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | 'bod' | 'green'>('all');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedDownloadMembers, setSelectedDownloadMembers] = useState<Set<string>>(new Set());

  // Filter and sort members by designation hierarchy
  const filteredMembers = activeMembers
    .filter(m => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const tier = getDesignationTier(m.designation);
      const matchesTier =
        selectedTierFilter === 'all' ||
        (selectedTierFilter === 'bod' && (tier === 'purple' || tier === 'yellow')) ||
        (selectedTierFilter === 'green' && tier === 'green');

      return matchesSearch && matchesTier;
    })
    .sort((a, b) => getDesignationRank(a.designation) - getDesignationRank(b.designation));

  const confirmRemoval = () => {
    if (memberToRemove) {
      removeMember(memberToRemove.id);
      if (selectedMemberCard?.id === memberToRemove.id) {
        setSelectedMemberCard(null);
      }
      setMemberToRemove(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header (Simplified title as requested) ────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Member Roster</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setIsDownloadModalOpen(true); setSelectedDownloadMembers(new Set()); }}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 transition-all cursor-pointer"
            title="Download Member Details"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setIsOnboardModalOpen(true); fetchLiveGoogleSheet(); }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F7A81B] to-[#D41B2C] text-slate-950 font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#F7A81B]/20"
          >
            <UserPlus className="w-4 h-4" />
            Onboard New Member
            {pendingCandidates.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-[#F7A81B] font-extrabold text-[10px]">
                {pendingCandidates.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, enrollment, course, or designation…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel text-xs text-white border border-white/10 focus:outline-none focus:border-[#F7A81B]"
          />
        </div>

        {/* Category Filter Tabs: Merged Core Team + Board into Board of Directors */}
        <div className="flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-white/10 overflow-x-auto">
          {[
            { id: 'all', label: 'All Members' },
            { id: 'bod', label: 'Board of Directors' },
            { id: 'green', label: 'Members' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTierFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedTierFilter === tab.id
                  ? tab.id === 'bod'
                    ? 'bg-gradient-to-r from-purple-600 to-[#F7A81B] text-white shadow-md'
                    : tab.id === 'green'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Members Table ───────────────────────────────── */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-white/10">
              <tr>
                <th className="p-4">Photo &amp; Name</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Course &amp; Year</th>
                <th className="p-4">Enrollment No.</th>
                <th className="p-4">Contact</th>
                <th className="p-4">DOB</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No members found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => {
                  const tier = getDesignationTier(member.designation);
                  const style = BADGE_STYLES[tier];

                  return (
                    <tr
                      key={member.id}
                      onClick={() => setSelectedMemberCard(member)}
                      className="hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={getDirectImageUrl(member.photoUrl)}
                          alt={member.name}
                          onError={e => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#D41B2C] group-hover:border-[#F7A81B] transition-colors flex-shrink-0"
                        />
                        <span className="text-sm font-bold text-white whitespace-nowrap">{member.name}</span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide ${style.bg} ${style.border}`}>
                          <ShieldCheck className={`w-3.5 h-3.5 ${style.iconColor}`} />
                          <span className="text-white">{member.designation}</span>
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-200">
                        {member.course} — <span className="text-slate-400">{member.currentYear} ({member.section})</span>
                      </td>
                      <td className="p-4 font-mono text-slate-300 text-[11px] whitespace-nowrap">{member.enrollmentNo}</td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-slate-200">{member.contactNo}</div>
                        <div className="text-slate-400 text-[11px]">{member.email}</div>
                      </td>
                      <td className="p-4 text-slate-300 whitespace-nowrap">{member.dob}</td>
                      <td className="p-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setMemberToRemove(member)}
                          title="Remove Member"
                          className="p-2 rounded-xl text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 transition-all cursor-pointer shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CONFIRM REMOVAL MODAL (Prevents Misclick Deletions & Deducts ₹1,200)
      ══════════════════════════════════════════════════════════ */}
      {memberToRemove && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setMemberToRemove(null)} />
          <div className="relative max-w-md w-full bg-[#0E131F] border border-rose-500/30 rounded-3xl p-6 z-10 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Confirm Member Removal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to remove <strong className="text-white">{memberToRemove.name}</strong> ({memberToRemove.enrollmentNo}) from the active roster?
              </p>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                ⚠️ This action will automatically record a <strong className="text-white">-₹1,200</strong> adjustment deduction in the Finance Ledger.
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoval}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <Trash2 className="w-4 h-4" />
                Confirm &amp; Deduct ₹1,200
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MEMBER DOSSIER CARD  (z-[100] — pixel-perfect ATM card, no scroll)
      ══════════════════════════════════════════════════════════ */}
      {selectedMemberCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedMemberCard(null)}
          />

          <div
            className="relative w-full z-10 shadow-[0_0_60px_rgba(233,30,99,0.25)]"
            style={{ maxWidth: 900 }}
          >
            <button
              onClick={() => setSelectedMemberCard(null)}
              className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-[#E91E63] hover:bg-pink-400 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className="flex rounded-3xl overflow-hidden border border-[#E91E63]/20"
              style={{ minHeight: 460 }}
            >
              {/* ══ LEFT: Pink Column ══════════════════════════════ */}
              <div
                className="flex flex-col items-center justify-between text-center relative overflow-hidden flex-shrink-0"
                style={{
                  width: 270,
                  background: 'linear-gradient(160deg, #F0107A 0%, #D81B60 50%, #880E4F 100%)',
                  padding: '56px 24px 36px',
                }}
              >
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-black/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center gap-4 w-full">
                  <div
                    className="rounded-full flex-shrink-0"
                    style={{
                      width: 148,
                      height: 148,
                      background: 'rgba(0,0,0,0.45)',
                      padding: 4,
                      boxShadow: '0 0 0 3px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.5)',
                    }}
                  >
                    <img
                      src={getDirectImageUrl(selectedMemberCard.photoUrl)}
                      alt={selectedMemberCard.name}
                      onError={e => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                      className="w-full h-full rounded-full object-cover"
                      style={{ border: '4px solid #090A0F' }}
                    />
                  </div>

                  <div className="space-y-1 w-full px-2">
                    <h2
                      className="font-black text-white leading-tight"
                      style={{ fontSize: selectedMemberCard.name.length > 16 ? 24 : 26, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                    >
                      {selectedMemberCard.name.length > 16 && selectedMemberCard.name.includes(' ') ? (
                        <>
                          {selectedMemberCard.name.split(' ').slice(0, -1).join(' ')}<br />
                          {selectedMemberCard.name.split(' ').slice(-1)[0]}
                        </>
                      ) : (
                        selectedMemberCard.name
                      )}
                    </h2>
                  </div>

                  {(() => {
                    const tier = getDesignationTier(selectedMemberCard.designation);
                    const style = BADGE_STYLES[tier];
                    return (
                      <div className={`inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full text-white text-xs font-bold border tracking-widest uppercase ${style.bg} ${style.border}`}>
                        <ShieldCheck className={`w-3.5 h-3.5 ${style.iconColor}`} />
                        {selectedMemberCard.designation}
                      </div>
                    );
                  })()}
                </div>

                <div className="relative z-10 w-full border-t border-white/20 pt-4 space-y-1">
                  <p className="text-xs font-black tracking-widest text-white uppercase leading-tight">
                    ROTARACT CLUB OF ACROPOLIS ROYALS
                  </p>
                  <p className="text-xs font-bold text-pink-200">RID 3040</p>
                </div>
              </div>

              {/* ══ RIGHT: Dark Details ════════════════════════════ */}
              <div
                className="flex-1 flex flex-col justify-between"
                style={{ background: '#0C0D12', padding: '28px 32px' }}
              >
                <div className="flex items-center justify-between" style={{ paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#E91E63', textTransform: 'uppercase', marginBottom: 3 }}>
                      ROTARACT ID
                    </p>
                    <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: 'monospace', letterSpacing: '0.05em', lineHeight: 1 }}>
                      {selectedMemberCard.riMembershipId}
                    </p>
                  </div>
                  <div className="flex items-center justify-end">
                    <img 
                      src="/logo.png" 
                      alt="Rotaract Club Logo" 
                      className="h-24 w-auto object-contain max-w-[260px] drop-shadow-xl" 
                    />
                  </div>
                </div>

                <div className="flex gap-8 items-center py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex-1 space-y-3.5">
                    <div className="flex items-center gap-1.5" style={{ marginBottom: 12 }}>
                      <Mail className="w-4 h-4" style={{ color: '#34d399' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: '#34d399', textTransform: 'uppercase' }}>
                        Contact Details
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 34, height: 34, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                        <Mail className="w-4 h-4" style={{ color: '#34d399' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>EMAIL ADDRESS</p>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>{selectedMemberCard.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 34, height: 34, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                        <Phone className="w-4 h-4" style={{ color: '#34d399' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>PHONE NUMBER</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{selectedMemberCard.contactNo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 34, height: 34, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                        <Calendar className="w-4 h-4" style={{ color: '#34d399' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>DATE OF BIRTH</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{selectedMemberCard.dob}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3.5">
                    <div className="flex items-center gap-1.5" style={{ marginBottom: 12 }}>
                      <GraduationCap className="w-4 h-4" style={{ color: '#34d399' }} />
                      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', color: '#34d399', textTransform: 'uppercase' }}>
                        Academic Profile
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 34, height: 34, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                        <BookOpen className="w-4 h-4" style={{ color: '#34d399' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>COURSE / DEGREE</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{selectedMemberCard.course}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 34, height: 34, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                        <User className="w-4 h-4" style={{ color: '#34d399' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>CURRENT YEAR</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{selectedMemberCard.currentYear} ({selectedMemberCard.section})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-lg flex-shrink-0 flex items-center justify-center" style={{ width: 34, height: 34, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                        <CreditCard className="w-4 h-4" style={{ color: '#34d399' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#34d399', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>ENROLLMENT NO.</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{selectedMemberCard.enrollmentNo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#a78bfa', textTransform: 'uppercase', marginBottom: 6 }}>
                    DOMAINS OF INTEREST
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMemberCard.domainsInterest.split(',').slice(0, 5).map((d, i) => {
                      const domain = d.trim();
                      if (!domain) return null;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-1.5"
                          style={{
                            padding: '5px 12px',
                            borderRadius: 50,
                            background: 'rgba(139,92,246,0.12)',
                            border: '1px solid rgba(139,92,246,0.3)',
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#f8fafc',
                          }}
                        >
                          {getDomainIcon(domain)}
                          <span>{domain}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ONBOARD NEW MEMBER MODAL  (z-50)
      ══════════════════════════════════════════════════════════ */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOnboardModalOpen(false)} />

          <div className="relative max-w-5xl w-full bg-[#0E131F] border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F7A81B]/15 text-[#F7A81B] border border-[#F7A81B]/30">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    Onboard New Members
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live Sync — {pendingCandidates.length} Candidates
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    Source:{' '}
                    <a
                      href="https://docs.google.com/spreadsheets/d/11GP8ylFH5VLhSD2tBw_7iUyKy9trzDY4kATMpYPspbw/edit"
                      target="_blank" rel="noreferrer"
                      className="text-[#F7A81B] hover:underline flex items-center gap-1"
                    >
                      Candidate Form Responses <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLiveGoogleSheet}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl glass-panel text-xs text-white border border-white/10 hover:bg-white/10 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#F7A81B] ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing…' : 'Sync Sheet'}
                </button>
                <button
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#D41B2C]" />
                </button>
              </div>
            </div>

            {/* Instruction strip */}
            <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 text-xs text-slate-300">
              Click <strong>Review</strong> to open the dossier card above this window,{' '}
              <strong>Add as Member</strong> to approve, or <strong>Delete</strong> to reject.
            </div>

            {/* Candidate list */}
            <div className="p-6 overflow-y-auto space-y-2.5 flex-1">
              {pendingCandidates.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">All Candidates Processed!</h3>
                  <p className="text-xs text-slate-400">No pending submissions in the Google Sheet.</p>
                </div>
              ) : (
                pendingCandidates.map(c => {
                  const key = c.enrollmentNo || c.email || c.id;
                  const isAlreadyAdded = addedMemberKeys.has(key) || activeMembers.some(m => (m.enrollmentNo && m.enrollmentNo === c.enrollmentNo) || m.id === c.id);

                  return (
                    <div
                      key={c.id}
                      className="glass-panel p-3.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Identity */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={getDirectImageUrl(c.photoUrl)}
                          alt={c.name}
                          onError={e => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#D41B2C] flex-shrink-0"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-white truncate">{c.name}</h3>
                            <span className="text-[10px] font-mono text-[#F7A81B] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                              {c.enrollmentNo}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 truncate">
                            {c.course} — <span className="text-slate-400">{c.currentYear} ({c.section})</span>
                            {' '}•{' '}<span className="text-slate-400">{c.contactNo}</span>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => setSelectedMemberCard(c)}
                          className="px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-200 hover:text-white hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#F7A81B]" /> Review
                        </button>
                        <button
                          onClick={() => deleteCandidate(c.id)}
                          className="px-3 py-1.5 rounded-xl glass-panel text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>

                        {/* PERSISTENT ONBOARD STATUS: "Added as Member" when candidate is already approved */}
                        {isAlreadyAdded ? (
                          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30">
                            <Check className="w-4 h-4 text-emerald-400" /> Added as Member
                          </span>
                        ) : (
                          <button
                            onClick={() => addMember(c)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                          >
                            <Check className="w-4 h-4" /> Add as Member
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
              <span className="text-xs text-slate-400">Rotaract Club of Acropolis Royals • Member Onboarding Command</span>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ══════════════════════════════════════════════════════════
          DOWNLOAD MODAL
      ══════════════════════════════════════════════════════════ */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsDownloadModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#0E131F] border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Download Members</h2>
                  <p className="text-xs text-slate-400">Select members to include in the PDF export</p>
                </div>
              </div>
              <button onClick={() => setIsDownloadModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center shrink-0">
              <button 
                onClick={() => {
                  if (selectedDownloadMembers.size === activeMembers.length) {
                    setSelectedDownloadMembers(new Set());
                  } else {
                    setSelectedDownloadMembers(new Set(activeMembers.map(m => m.id)));
                  }
                }}
                className="text-sm text-[#38BDF8] hover:text-white font-bold transition-colors cursor-pointer"
              >
                {selectedDownloadMembers.size === activeMembers.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-sm font-medium text-slate-400">
                {selectedDownloadMembers.size} selected
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              {activeMembers.map((member) => (
                <label key={member.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedDownloadMembers.has(member.id)}
                    onChange={() => {
                      const newSet = new Set(selectedDownloadMembers);
                      if (newSet.has(member.id)) {
                        newSet.delete(member.id);
                      } else {
                        newSet.add(member.id);
                      }
                      setSelectedDownloadMembers(newSet);
                    }}
                    className="w-5 h-5 rounded border-white/20 text-[#38BDF8] focus:ring-[#38BDF8]"
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img 
                      src={getDirectImageUrl(member.photoUrl) || DEFAULT_AVATAR} 
                      alt="" 
                      onError={e => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
                      className="w-10 h-10 rounded-lg object-cover" 
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{member.name}</p>
                      <p className="text-xs text-slate-400 truncate">{member.designation || 'Member'}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 bg-white/5 shrink-0 flex justify-end">
              <button
                disabled={selectedDownloadMembers.size === 0}
                onClick={() => {
                  setIsDownloadModalOpen(false);
                  setTimeout(() => window.print(), 100);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden print-only view for Selected Members */}
      <div className="hidden print:block absolute inset-0 bg-white z-[9999]">
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print\\:block, .print\\:block * { visibility: visible; }
            .print\\:block { position: absolute; left: 0; top: 0; width: 100%; color: black; background: white; }
          }
        `}</style>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-black mb-6 border-b pb-4">Member Roster</h1>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 px-4 font-bold">Name</th>
                <th className="py-2 px-4 font-bold">Designation</th>
                <th className="py-2 px-4 font-bold">Enrollment No</th>
                <th className="py-2 px-4 font-bold">Email</th>
                <th className="py-2 px-4 font-bold">Contact</th>
                <th className="py-2 px-4 font-bold">DOB</th>
              </tr>
            </thead>
            <tbody>
              {activeMembers.filter(m => selectedDownloadMembers.has(m.id)).map(member => (
                <tr key={member.id} className="border-b border-gray-300">
                  <td className="py-2 px-4">{member.name}</td>
                  <td className="py-2 px-4">{member.designation || 'Member'}</td>
                  <td className="py-2 px-4">{member.enrollmentNo}</td>
                  <td className="py-2 px-4">{member.email}</td>
                  <td className="py-2 px-4">{member.contactNo || '-'}</td>
                  <td className="py-2 px-4">{member.dob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
