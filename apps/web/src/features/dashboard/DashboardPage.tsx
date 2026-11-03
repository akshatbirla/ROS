import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Calendar, DollarSign, Users, AlertCircle, CheckCircle2, Clock, Plus, Download, 
  FileText, Globe, HeartHandshake, Award, Sparkles, ArrowRight, ShieldCheck, Landmark, Flame,
  Settings, UserCheck, BookOpen, BarChart3, Briefcase, Share2, Layers, Grid, GitBranch
} from 'lucide-react';
import { useApp } from '../../app/AppContext';
import { PageId } from '../../app/Navigation';
import { SpotlightCard } from '../../components/SpotlightCard';

const AVENUE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Club Service': { bg: 'bg-[#F7A81B]/15', text: 'text-[#F7A81B]', border: 'border-[#F7A81B]/30' },
  'Community Service': { bg: 'bg-[#D41B2C]/15', text: 'text-[#D41B2C]', border: 'border-[#D41B2C]/30' },
  'Professional Dev': { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30' },
  'International Service': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Vocational Service': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Executive Board': { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  Scheduled: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  'In Planning': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  Completed: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
};

interface DashboardPageProps {
  activeRole?: string;
  setActivePage?: (page: PageId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  activeRole = 'Public View',
  setActivePage = () => {}
}) => {
  const { appSettings, activeMembers, events } = useApp();
  const [adminViewMode, setAdminViewMode] = useState<'matrix' | 'nexus'>('nexus');
  const isPublicView = activeRole === 'Public View';

  const happenedEvents = events.filter((e) => e.status === 'happened');
  const totalBeneficiaries = happenedEvents.reduce((acc, curr) => acc + (curr.beneficiaries || 0), 0);
  const totalServiceHours = happenedEvents.reduce((acc, curr) => acc + ((curr.actualDurationHours || 2) * (curr.nominatedMemberIds?.length || 8)), 0);

  /* -------------------------------------------------------------------------- */
  /*                            PUBLIC DASHBOARD VIEW                           */
  /* -------------------------------------------------------------------------- */
  if (isPublicView) {
    return (
      <div className="space-y-10 pb-16">
        {/* Public Header / Club Identity Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden glass-panel rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#F7A81B]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#D41B2C]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7A81B]/10 border border-[#F7A81B]/30 text-[#F7A81B] text-xs font-semibold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              Public Impact Transparency Portal
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              What We Do & How We <span className="gold-gradient-text">Serve</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              The <strong className="text-white">Rotaract Club of Acropolis Royals</strong> (District 3040) is a youth-led community dedicated to service, leadership development, and societal empowerment under the motto <span className="text-[#F7A81B]">"Service Above Self"</span>.
            </p>
          </div>
        </motion.div>

        {/* Public Verified Impact KPIs (3 Core Impact Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Community Beneficiaries",
              value: totalBeneficiaries > 0 ? `${totalBeneficiaries}+` : '0',
              sub: "Direct lives impacted across city outreach & drives",
              icon: HeartHandshake,
              glowColor: "rgba(52, 211, 153, 0.25)",
              borderHover: "hover:border-emerald-500/50",
              textGlow: "from-emerald-400 to-teal-300",
              tag: "Humanitarian Impact",
              iconBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
            },
            {
              title: "Service Projects Completed",
              value: `${happenedEvents.length} Projects`,
              sub: "Documented initiatives across all 5 Rotary Avenues",
              icon: Award,
              glowColor: "rgba(247, 168, 27, 0.25)",
              borderHover: "hover:border-[#F7A81B]/50",
              textGlow: "from-[#F7A81B] to-amber-200",
              tag: "Verified Execution",
              iconBg: "bg-[#F7A81B]/15 text-[#F7A81B] border-[#F7A81B]/30",
            },
            {
              title: "Volunteer Service Hours",
              value: totalServiceHours > 0 ? `${totalServiceHours}+ Hrs` : '0 Hrs',
              sub: "On-ground selfless community leadership",
              icon: Clock,
              glowColor: "rgba(212, 27, 44, 0.25)",
              borderHover: "hover:border-[#D41B2C]/50",
              textGlow: "from-rose-400 to-[#D41B2C]",
              tag: "Service Above Self",
              iconBg: "bg-[#D41B2C]/15 text-[#D41B2C] border-[#D41B2C]/30",
            },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4, scale: 1.015 }}
                className={`glass-panel p-6 rounded-3xl border border-white/10 ${kpi.borderHover} transition-all duration-300 relative overflow-hidden group shadow-lg`}
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`
                }}
              >
                {/* Dynamic Mouse / Hover Radial Glow */}
                <div 
                  className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                  style={{
                    background: `radial-gradient(320px circle at 50% 0%, ${kpi.glowColor}, transparent 70%)`
                  }}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {kpi.tag}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${kpi.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-4xl font-black bg-gradient-to-r ${kpi.textGlow} bg-clip-text text-transparent drop-shadow-sm`}>
                      {kpi.value}
                    </h3>
                    <p className="text-xs font-semibold text-white mt-1">{kpi.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{kpi.sub}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Public Avenues of Service - Impact Dashboard Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#F7A81B] uppercase tracking-wider mb-2">
                <Landmark className="w-3.5 h-3.5" /> Core Service Framework
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                The Five Avenues of <span className="gold-gradient-text">Rotary Service</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Every project and initiative in our club is structurally aligned under these foundational pillars to drive balanced community upliftment.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-500 font-mono block">Rotary Club of Acropolis Royals</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Operations
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: "Community Service",
                tagline: "Empowering Local Lives & Welfare",
                desc: "Grassroots humanitarian interventions targeting immediate societal needs: animal rescue & feeding (Paws & Claws), medical donation camps, seasonal clothing drives, and environmental sustainability.",
                stat: "16+ Drives Completed",
                color: "text-[#D41B2C]",
                accentBg: "bg-[#D41B2C]/10 border-[#D41B2C]/30",
                gradient: "from-[#D41B2C]/15 via-transparent to-transparent",
                glow: "rgba(212, 27, 44, 0.2)",
              },
              {
                name: "Club Service",
                tagline: "Fellowship, Culture & Member Unity",
                desc: "The lifeblood of our club. Organizes general body meetings, team retreats, induction banquets, and fellowship summits that build lifelong camaraderie and trust between young leaders.",
                stat: "100% General Attendance",
                color: "text-[#F7A81B]",
                accentBg: "bg-[#F7A81B]/10 border-[#F7A81B]/30",
                gradient: "from-[#F7A81B]/15 via-transparent to-transparent",
                glow: "rgba(247, 168, 27, 0.2)",
              },
              {
                name: "Professional Development",
                tagline: "Career Excellence & Executive Skills",
                desc: "Equipping college students with high-leverage professional competencies: mock campus placements, technical seminars, resume clinics, public speaking masterclasses, and corporate CXO interactions.",
                stat: "12+ Skill Workshops",
                color: "text-sky-400",
                accentBg: "bg-sky-500/10 border-sky-500/30",
                gradient: "from-sky-500/15 via-transparent to-transparent",
                glow: "rgba(56, 189, 248, 0.2)",
              },
              {
                name: "International Service",
                tagline: "Cross-Border Peace & Global Exchanges",
                desc: "Bridging geographical and cultural boundaries through twin club agreements, virtual dialogues on global issues, and international cultural showcases with fellow Rotaractors across continents.",
                stat: "Global Club Alliances",
                color: "text-emerald-400",
                accentBg: "bg-emerald-500/10 border-emerald-500/30",
                gradient: "from-emerald-500/15 via-transparent to-transparent",
                glow: "rgba(52, 211, 153, 0.2)",
              },
              {
                name: "Vocational Service",
                tagline: "Ethics, Dignity of Labor & Mentorship",
                desc: "Advocating high ethical standards in all callings, honoring local craftsmen and essential community workers, and providing career counseling to underprivileged school youth.",
                stat: "Ethical Leadership Focus",
                color: "text-purple-400",
                accentBg: "bg-purple-500/10 border-purple-500/30",
                gradient: "from-purple-500/15 via-transparent to-transparent",
                glow: "rgba(168, 85, 247, 0.2)",
              },
            ].map((ave, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all relative overflow-hidden group flex flex-col justify-between"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(280px circle at 50% 0%, ${ave.glow}, transparent 70%)`
                  }}
                />

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${ave.accentBg} ${ave.color}`}>
                      Avenue #{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ave.stat}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-[#F7A81B] transition-colors">
                      {ave.name}
                    </h3>
                    <p className={`text-[11px] font-semibold mt-0.5 ${ave.color}`}>
                      {ave.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {ave.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Led by Avenue Director</span>
                  <span className="text-[#F7A81B] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Discover projects →
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Public Join CTA Banner */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Join the Movement
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">Ready to Shape the Future with Us?</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Become a part of District 3040’s premier youth leadership collective. Drive impact, forge lifelong fellowship, and grow into a changemaker.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActivePage('about_us')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              How to Join Us <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('photo_gallery')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl glass-panel text-slate-200 text-xs font-semibold hover:text-white hover:bg-white/10 transition-all border border-white/10 cursor-pointer"
            >
              Browse Photo Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                      EXECUTIVE COMMAND CENTER (ADMIN VIEW)                 */
  /* -------------------------------------------------------------------------- */

  // Master Modules Network Nodes (connecting all 10 features into a central hub)
  const COMMAND_NODES = [
    {
      id: 'members',
      label: 'Members Roster',
      category: 'Talent & Roster',
      desc: 'Directory, discipline score & Google Sheet synchronization',
      icon: Users,
      badge: `${activeMembers.length} Active`,
      color: 'from-[#F7A81B]/20 to-transparent',
      border: 'border-[#F7A81B]/30 hover:border-[#F7A81B]',
      iconColor: 'text-[#F7A81B]',
      branch: 'Top-Left',
    },
    {
      id: 'event_proposal',
      label: 'Events & Projects',
      category: 'Operations',
      desc: 'Proposal builder, avenue budgeting & live project tracking',
      icon: FileText,
      badge: 'Active Hub',
      color: 'from-sky-500/20 to-transparent',
      border: 'border-sky-500/30 hover:border-sky-400',
      iconColor: 'text-sky-400',
      branch: 'Top-Right',
    },
    {
      id: 'finance',
      label: 'Treasury & Ledger',
      category: 'Fiscal Audit',
      desc: 'Live income, expenses, vouchers & dual-authorized balance',
      icon: DollarSign,
      badge: '₹48,500',
      color: 'from-emerald-500/20 to-transparent',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      iconColor: 'text-emerald-400',
      branch: 'Right',
    },
    {
      id: 'meetings',
      label: 'Meetings & Minutes',
      category: 'Governance',
      desc: 'Scheduler, General Body agendas & recorded secretarial minutes',
      icon: Calendar,
      badge: 'GBM #04',
      color: 'from-purple-500/20 to-transparent',
      border: 'border-purple-500/30 hover:border-purple-400',
      iconColor: 'text-purple-400',
      branch: 'Bottom-Right',
    },
    {
      id: 'reports',
      label: 'Official Reports',
      category: 'Compliance',
      desc: 'Monthly district reports, Avenue summaries & PDF exports',
      icon: Award,
      badge: 'RY Dossiers',
      color: 'from-amber-500/20 to-transparent',
      border: 'border-amber-500/30 hover:border-amber-400',
      iconColor: 'text-amber-400',
      branch: 'Bottom-Left',
    },
    {
      id: 'analytics',
      label: 'Intelligence & Health',
      category: 'Analytics',
      desc: 'Attendance graphs, avenue distribution charts & historical trends',
      icon: BarChart3,
      badge: '94.2% Health',
      color: 'from-teal-500/20 to-transparent',
      border: 'border-teal-500/30 hover:border-teal-400',
      iconColor: 'text-teal-400',
      branch: 'Left',
    },
    {
      id: 'contacts',
      label: 'External Directory',
      category: 'Partnerships',
      desc: 'District 3040 roster, sponsors, partners & alumni connections',
      icon: Briefcase,
      badge: 'Network',
      color: 'from-indigo-500/20 to-transparent',
      border: 'border-indigo-500/30 hover:border-indigo-400',
      iconColor: 'text-indigo-400',
      branch: 'Sub-Hub',
    },
    {
      id: 'events_archive',
      label: 'Events Archive',
      category: 'Historical Memory',
      desc: 'Complete log of past projects, guest footfall & beneficiary records',
      icon: Clock,
      badge: 'Archives',
      color: 'from-rose-500/20 to-transparent',
      border: 'border-rose-500/30 hover:border-rose-400',
      iconColor: 'text-rose-400',
      branch: 'Sub-Hub',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Title (Cleaned up, statement removed) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7A81B]/15 text-[#F7A81B] font-bold border border-[#F7A81B]/30 uppercase tracking-wider">
              {activeRole}
            </span>
            <span className="text-xs text-slate-400">Executive Master Command</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Operational Command Center</h1>
        </div>

        {/* View Switcher & Quick Tools */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setAdminViewMode('nexus')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                adminViewMode === 'nexus'
                  ? 'bg-[#F7A81B] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" /> Web Nexus
            </button>
            <button
              onClick={() => setAdminViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                adminViewMode === 'matrix'
                  ? 'bg-[#F7A81B] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid View
            </button>
          </div>

          <button 
            onClick={() => setActivePage('event_proposal')}
            className="px-4 py-2.5 rounded-xl bg-[#F7A81B] text-slate-950 text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#F7A81B]/20"
          >
            <Plus className="w-4 h-4" />
            Quick Planner
          </button>
        </div>
      </motion.div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Total Active Roster", value: `${activeMembers.length} Royals`, sub: "100% Verified in DB", icon: Users, color: "from-[#F7A81B]/20 to-transparent", border: "border-[#F7A81B]/30", page: 'members' as PageId },
          { title: "Monthly Attendance", value: "94.2%", sub: "Institutional metric", icon: Activity, color: "from-emerald-500/20 to-transparent", border: "border-emerald-500/30", page: 'analytics' as PageId },
          { title: "Quarterly Treasury", value: "₹48,500", sub: "Audited ledger balance", icon: DollarSign, color: "from-amber-500/20 to-transparent", border: "border-amber-500/30", page: 'finance' as PageId },
          { title: "Pending Tasks", value: "3 Actions", sub: "Awaiting presidential seal", icon: AlertCircle, color: "from-[#D41B2C]/20 to-transparent", border: "border-[#D41B2C]/30", page: 'event_proposal' as PageId },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setActivePage(kpi.page)}
              className={`glass-panel p-5 rounded-2xl border ${kpi.border} bg-gradient-to-br ${kpi.color} cursor-pointer hover:border-white/30 transition-all`}
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium uppercase tracking-wider">{kpi.title}</span>
                <div className="p-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mt-4 drop-shadow-md">{kpi.value}</h3>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">{kpi.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* NEXUS INTERACTIVE WEB VIEW: Center Core Settings Hub with Branching Web Network */}
      {adminViewMode === 'nexus' ? (
        <div className="relative rounded-3xl glass-panel border border-white/10 p-6 md:p-10 overflow-hidden bg-gradient-to-b from-[#0E131F]/90 to-[#080B11]/90 shadow-2xl">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(#F7A81B_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Central Core Settings Nexus Node */}
          <div className="flex flex-col items-center justify-center my-6 relative z-20">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActivePage('settings')}
              className="relative p-6 rounded-full bg-gradient-to-tr from-[#F7A81B] via-amber-500 to-[#D41B2C] text-slate-950 shadow-[0_0_50px_rgba(247,168,27,0.4)] cursor-pointer group flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-25" />
              <Settings className="w-9 h-9 text-slate-950 group-hover:rotate-90 transition-transform duration-700" />
            </motion.button>
            <h3 className="text-sm font-extrabold text-white mt-3 uppercase tracking-wider flex items-center gap-1.5">
              Club Configuration Hub
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">Central Operating Kernel • Click for Club Settings</p>
          </div>

          {/* Connected Web Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10 pt-4">
            {COMMAND_NODES.map((node, i) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setActivePage(node.id as PageId)}
                  className={`glass-panel p-5 rounded-2xl border ${node.border} bg-gradient-to-br ${node.color} cursor-pointer transition-all duration-300 relative group overflow-hidden shadow-lg`}
                >
                  {/* Subtle Web Indicator Line */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {node.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#F7A81B]">
                      {node.badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${node.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#F7A81B] transition-colors">
                        {node.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {node.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">Open Module</span>
                    <span className="text-[#F7A81B] group-hover:translate-x-1 transition-transform">
                      Launch →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MATRIX TABULAR LIST VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#F7A81B]" />
              Internal Operational Pipeline
            </h2>
            <div className="space-y-3">
              {[
                { name: "Blood Donation Camp 2026", avenue: "Community Service", date: "Aug 12, 2026 • 09:00 AM", status: "Approved", lead: "Rtr. Ishita Gupta" },
                { name: "Leadership Development Workshop", avenue: "Professional Dev", date: "Aug 18, 2026 • 04:00 PM", status: "In Planning", lead: "Rtr. Kshitij Nair" },
                { name: "General Body Meeting #03", avenue: "Club Service", date: "Aug 25, 2026 • 05:30 PM", status: "Scheduled", lead: "Rtr. Priya Verma" },
                { name: "International Cultural Exchange", avenue: "International Service", date: "Sep 02, 2026 • 07:00 PM", status: "Scheduled", lead: "Rtr. Sanya Malhotra" },
              ].map((evt, i) => {
                const avColor = AVENUE_COLORS[evt.avenue] || { bg: 'bg-white/10', text: 'text-white', border: 'border-white/10' };
                const stColor = STATUS_COLORS[evt.status] || { bg: 'bg-white/10', text: 'text-white', border: 'border-white/10' };

                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.01, x: 5 }}
                    onClick={() => setActivePage('event_proposal')}
                    className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${avColor.bg} ${avColor.text} ${avColor.border}`}>
                          {evt.avenue}
                        </span>
                        <h3 className="text-sm font-bold text-white">{evt.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {evt.date} • Lead: {evt.lead}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${stColor.bg} ${stColor.text} ${stColor.border} self-start sm:self-center shadow-sm`}>
                      {evt.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#D41B2C]" />
              Quick Executive Actions
            </h2>
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <button 
                onClick={() => setActivePage('reports')}
                className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between text-xs text-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2 font-medium">
                  <div className="p-1.5 rounded bg-[#F7A81B]/10"><FileText className="w-4 h-4 text-[#F7A81B]" /></div>
                  Generate Advisor Attendance PDF
                </span>
                <span className="text-slate-500">→</span>
              </button>
              <button 
                onClick={() => setActivePage('members')}
                className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between text-xs text-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2 font-medium">
                  <div className="p-1.5 rounded bg-[#D41B2C]/10"><Users className="w-4 h-4 text-[#D41B2C]" /></div>
                  Update Member Discipline Score
                </span>
                <span className="text-slate-500">→</span>
              </button>
              <button 
                onClick={() => setActivePage('finance')}
                className="w-full text-left p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between text-xs text-slate-200 cursor-pointer"
              >
                <span className="flex items-center gap-2 font-medium">
                  <div className="p-1.5 rounded bg-emerald-500/10"><DollarSign className="w-4 h-4 text-emerald-400" /></div>
                  Log Financial Receipt / Ledger
                </span>
                <span className="text-slate-500">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
