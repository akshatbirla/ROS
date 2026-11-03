import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, Users, Globe, Mail, MapPin, Phone, ChevronDown, 
  HelpCircle, ArrowRight, MessageCircle, Hash, Link as LinkIcon, Share2, 
  Flame, Rocket
} from 'lucide-react';
import { RotaryWheel3D } from '../../components/RotaryWheel3D';
import { Tilt3DCard } from '../../components/Tilt3DCard';
import { BorderGlow } from '../../components/BorderGlow';

const FAQS = [
  {
    q: "Who can join the Rotaract Club?",
    a: "Membership is open to young adults aged 18 and above, including students of Acropolis Institute of Technology and young professionals who demonstrate high ethical standards and commitment to community service."
  },
  {
    q: "What is the commitment required?",
    a: "Members are expected to attend general body meetings (usually twice a month) and actively participate in at least one club project per quarter. We value active participation and discipline."
  },
  {
    q: "How are the projects funded?",
    a: "Projects are funded through a combination of membership dues, fundraising events, sponsorships from local businesses, and support from our parent Rotary club."
  },
  {
    q: "What are the benefits of joining?",
    a: "You get to develop leadership skills, expand your professional network, make lasting friendships, and most importantly, make a tangible positive impact in your community."
  }
];

export const AboutUsPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Ensure scroll is positioned at the top on mount
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* 3D Dynamic Interactive Hero */}
      <BorderGlow className="rounded-3xl">
        <section className="relative rounded-[inherit] overflow-hidden glass-panel p-8 md:p-14 border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F7A81B]/15 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20 z-0" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D41B2C]/15 rounded-full blur-3xl pointer-events-none -mb-20 -ml-20 z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
              >
                Where Passion Meets <br />
                <span className="gold-gradient-text">Purpose & Action</span>
              </motion.h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                We are the <strong className="text-white">Rotaract Club of Acropolis Royals</strong> — a vibrant collective of students and young professionals transforming empathy into tangible community change and global leadership.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('join-movement');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#F7A81B] to-[#D41B2C] text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-[#F7A81B]/20 cursor-pointer"
                >
                  Join our Club <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Interactive 3D Rotary Wheel (Free-floating boundless canvas) */}
            <div className="lg:col-span-5 relative flex items-center justify-center overflow-visible">
              <div className="relative w-full max-w-[540px] h-[480px] flex items-center justify-center overflow-visible">
                <RotaryWheel3D className="w-full h-full" imageSrc="/rotary-wheel.png" />
              </div>
            </div>
          </div>
        </section>
      </BorderGlow>

      {/* Interactive Value Proposition / Why Royals */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-[#D41B2C]" />
            Why Join Rotaract Royals?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">Discover what makes membership a life-altering experience.</p>
        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Leadership by Action",
              desc: "Don't just add lines to your resume. Take ownership of 500+ beneficiary drives, manage real budgets, and inspire youth teams.",
              icon: Rocket,
              color: "text-[#F7A81B]",
              glow: "rgba(247, 168, 27, 0.25)"
            },
            {
              title: "Global Fellowship",
              desc: "Connect with Rotary clubs across 180+ countries. Participate in international cultural exchanges and twin-club collaborations.",
              icon: Globe,
              color: "text-sky-400",
              glow: "rgba(56, 189, 248, 0.25)"
            },
            {
              title: "Institutional Impact",
              desc: "From animal rescue (Paws & Claws) to slum education (Pathshala), leave a legacy that outlasts your college years.",
              icon: HeartHandshake,
              color: "text-emerald-400",
              glow: "rgba(52, 211, 153, 0.25)"
            },
          ].map((card, i) => (
            <Tilt3DCard key={i} glowColor={card.glow} className="glass-panel p-6 rounded-2xl border border-white/10 h-full">
              <div className="space-y-4">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 w-fit ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
              </div>
            </Tilt3DCard>
          ))}
        </div>
      </section>

      {/* How to Join Us (Interactive Action Hub) */}
      <section id="join-movement" className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20 z-0" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-white">Ready to be part of the <span className="text-emerald-400">club?</span></h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm">
              Every great leader started with a single step. By joining Rotaract Royals, you step into a community that celebrates your drive and provides the platform to make an unforgettable mark.
            </p>
            <ul className="space-y-4 text-slate-400 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                <p>Attend our next General Body Meeting as an invited guest to experience our club culture.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                <p>Fill out the membership interest questionnaire and meet our Board of Directors.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                <p>Get formally inducted during our pinning ceremony and begin your journey of impact!</p>
              </li>
            </ul>

            <div className="pt-2">
              <a 
                href="https://forms.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                Apply for Royals Membership <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Tilt3DCard glowColor="rgba(52, 211, 153, 0.2)">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                alt="Rotaract Team Fellowship" 
                className="rounded-2xl w-full h-52 object-cover border border-white/10 shadow-lg" 
              />
            </Tilt3DCard>
            <Tilt3DCard glowColor="rgba(247, 168, 27, 0.2)">
              <img 
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80" 
                alt="Community Impact Meeting" 
                className="rounded-2xl w-full h-52 object-cover border border-white/10 shadow-lg mt-6" 
              />
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* FAQ & Contact Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQ */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className={`glass-panel border transition-all rounded-xl overflow-hidden cursor-pointer ${openFaq === idx ? 'border-sky-500/30 bg-sky-500/5' : 'border-white/10 hover:border-white/20'}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="p-4 flex items-center justify-between">
                  <h3 className={`font-semibold text-sm ${openFaq === idx ? 'text-sky-400' : 'text-white'}`}>{faq.q}</h3>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-sky-400' : 'text-slate-500'}`} />
                </div>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-slate-400 text-sm leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Socials */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-[#F7A81B]" />
            <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Club Headquarters</h4>
                  <p className="text-slate-400 text-sm mt-1">Acropolis Institute of Technology and Research, Bypass Road, Indore, MP</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Email Us</h4>
                  <p className="text-slate-400 text-sm mt-1">contact@rcacropolisroyals.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Call Us</h4>
                  <p className="text-slate-400 text-sm mt-1">+91 98765 43210 (President Desk)</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-white font-medium text-sm mb-4">Connect with us on Social Media</h4>
              <div className="flex items-center gap-3">
                {[
                  { icon: Hash, color: 'hover:text-pink-500', bg: 'hover:bg-pink-500/10 hover:border-pink-500/30' },
                  { icon: LinkIcon, color: 'hover:text-sky-500', bg: 'hover:bg-sky-500/10 hover:border-sky-500/30' },
                  { icon: MessageCircle, color: 'hover:text-blue-500', bg: 'hover:bg-blue-500/10 hover:border-blue-500/30' },
                  { icon: Share2, color: 'hover:text-sky-400', bg: 'hover:bg-sky-400/10 hover:border-sky-400/30' },
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a 
                      key={idx} 
                      href="#" 
                      className={`p-3 rounded-xl glass-panel border border-white/10 text-slate-400 transition-all cursor-pointer ${social.color} ${social.bg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
