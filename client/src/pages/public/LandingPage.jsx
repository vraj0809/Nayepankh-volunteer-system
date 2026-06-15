import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, MapPin, GraduationCap, Award,
  Zap, Star, Target, Lightbulb, Briefcase, Megaphone,
  BookOpen, CheckCircle, ChevronRight, Heart, Shield,
  TrendingUp, Globe,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FOCUS_AREAS, TESTIMONIALS, IMPACT_STATS } from '../../utils/constants';

const iconMap = { GraduationCap, Lightbulb, Briefcase, Megaphone, Target, Users };

/* ── Animated counter ── */
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let s = 0;
    const step = end / (duration / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= end) { setCount(end); clearInterval(t); }
      else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── Reveal on scroll ── */
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), delay);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
};

const LandingPage = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden gradient-mesh hero-pattern">
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/3 blur-[120px] pointer-events-none" />

        <div className="relative page-container py-28 sm:py-36 md:py-44">
          <div className="max-w-4xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 mb-8 border border-emerald-500/20 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase">NayePankh Foundation · Empowering Students Across India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in-up">
              Give{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Wings
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q100 0 200 6" stroke="url(#u1)" strokeWidth="2" fill="none" />
                  <defs>
                    <linearGradient id="u1" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#10b981" /><stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{' '}
              to Someone's
              <br />
              <span className="text-slate-300">Dream.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              Join India's fastest-growing volunteer network. Mentor students,
              build skills, and create lasting change — one student at a time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/register"
                className="btn-primary text-base px-8 py-4 rounded-xl animate-pulse-glow"
              >
                Start Volunteering
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#about"
                className="btn-outline text-base px-8 py-4 rounded-xl"
              >
                Explore Mission
              </a>
            </div>

            {/* Program pillars bar */}
            <div
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 animate-fade-in-up"
              style={{ animationDelay: '0.5s' }}
            >
              {[
                { label: 'Mentorship', icon: '🎯' },
                { label: 'Skill Workshops', icon: '💡' },
                { label: 'Career Guidance', icon: '📈' },
                { label: 'Internships', icon: '💼' },
              ].map((item) => (
                <div key={item.label} className="p-5 bg-surface-card text-center hover:bg-surface-elevated transition-colors">
                  <p className="text-2xl mb-1">{item.icon}</p>
                  <p className="text-slate-300 text-xs tracking-wide font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT ═══════════ */}
      <section id="about" className="py-20 md:py-32" style={{ background: '#0f1629' }}>
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div className="relative">
                {/* Main card */}
                <div className="relative rounded-3xl overflow-hidden border border-white/8 bg-surface-card p-8 md:p-10">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-violet-500" />
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/20 flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">NayePankh Foundation</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    A registered Indian NGO on a mission to break barriers of education and opportunity
                    for underprivileged students across the nation.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                      { icon: Globe, label: 'Pan-India Reach', sub: 'Multiple cities' },
                      { icon: Shield, label: 'Registered NGO', sub: 'India' },
                      { icon: TrendingUp, label: 'Growing Community', sub: 'New volunteers daily' },
                      { icon: Users, label: 'Volunteers', sub: 'Join us today!' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                        <item.icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <div>
                          <p className="text-white text-xs font-semibold">{item.label}</p>
                          <p className="text-slate-500 text-xs">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative bg shapes */}
                <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-emerald-500/8 blur-2xl -z-10" />
                <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-violet-600/8 blur-2xl -z-10" />
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div>
                <span className="section-badge">About Us</span>
                <h2 className="section-title mt-3 mb-5">
                  Empowering Students,<br />
                  <span className="text-emerald-400">Transforming Lives</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-5">
                  NayePankh Foundation bridges the gap between aspiring students and the opportunities
                  they deserve. Through mentorship, skill-building workshops, internship placements,
                  and peer support programs, we give every student a fair shot at success.
                </p>
                <p className="text-slate-400 leading-relaxed mb-8">
                  We believe talent is everywhere — but opportunity is not. Our volunteer-powered model
                  connects passionate individuals with students who need guidance, creating a ripple
                  effect of positive change across India.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Student-First', 'Volunteer-Powered', 'Data-Driven', 'Impact-Focused'].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-lg text-xs font-semibold font-mono tracking-wide border border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ MISSION & VISION ═══════════ */}
      <section id="mission" className="py-20 md:py-32" style={{ background: '#0a0f1e' }}>
        <div className="page-container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-badge">Our Purpose</span>
              <h2 className="section-title mt-3">Mission & Vision</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal delay={100}>
              <div className="relative rounded-2xl p-8 md:p-10 border border-emerald-500/15 bg-gradient-to-br from-emerald-950/40 to-transparent card-hover overflow-hidden">
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.08) 0%, transparent 60%)' }} />
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  To empower underprivileged and aspiring students by providing mentorship,
                  internships, skill development, and real-world opportunities. We bridge the
                  gap between potential and opportunity so every student can reach their full potential.
                </p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <span className="text-xs font-mono text-emerald-500 tracking-widest">MISSION_2025</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative rounded-2xl p-8 md:p-10 border border-violet-500/15 bg-gradient-to-br from-violet-950/40 to-transparent card-hover overflow-hidden">
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                  <Lightbulb className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  A society where every student has an equal chance to learn, grow, and succeed — a
                  future where background doesn't define destiny, where talent is nurtured, and
                  every dream is given wings to fly.
                </p>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <span className="text-xs font-mono text-violet-500 tracking-widest">VISION_2030</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ FOCUS AREAS ═══════════ */}
      <section className="py-20 md:py-32" style={{ background: '#0f1629' }}>
        <div className="page-container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-badge">What We Do</span>
              <h2 className="section-title mt-3">Our Focus Areas</h2>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                A multi-dimensional approach to student empowerment.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FOCUS_AREAS.map((area, i) => {
              const Icon = iconMap[area.icon] || BookOpen;
              const colors = [
                { border: 'border-emerald-500/20', bg: 'bg-emerald-500/8', text: 'text-emerald-400' },
                { border: 'border-violet-500/20', bg: 'bg-violet-500/8', text: 'text-violet-400' },
                { border: 'border-cyan-500/20', bg: 'bg-cyan-500/8', text: 'text-cyan-400' },
              ][i % 3];
              return (
                <Reveal key={area.title} delay={i * 80}>
                  <div className={`p-6 rounded-2xl border ${colors.border} bg-surface-card card-hover h-full`}>
                    <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{area.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{area.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ IMPACT STATS ═══════════ */}
      <section id="impact" className="py-20 md:py-32 relative overflow-hidden" style={{ background: '#060b16' }}>
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        <div className="relative page-container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-badge">Our Impact</span>
              <h2 className="section-title mt-3 text-white">
                Numbers That{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                  Speak
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {IMPACT_STATS.map((stat, i) => {
              const icons = [Users, MapPin, GraduationCap, Award];
              const Icon = icons[i] || Star;
              const colors = ['text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                'text-violet-400 bg-violet-500/10 border-violet-500/20',
                'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                'text-amber-400 bg-amber-500/10 border-amber-500/20'][i] || 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
              return (
                <Reveal key={stat.label} delay={i * 120}>
                  <div className="card-elevated p-6 text-center card-hover">
                    <div className={`w-12 h-12 mx-auto rounded-2xl border flex items-center justify-center mb-4 ${colors}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-white font-mono">
                      <Counter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-slate-400 text-xs mt-2 tracking-wide">{stat.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 md:py-32" style={{ background: '#0f1629' }}>
        <div className="page-container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-badge">Get Started</span>
              <h2 className="section-title mt-3">How It Works</h2>
            </div>
          </Reveal>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-violet-500/30 to-transparent" />

            {[
              { step: '01', title: 'Register', desc: 'Fill out our streamlined registration form with your skills, background, and interests. Takes under 5 minutes.', icon: BookOpen, color: 'emerald' },
              { step: '02', title: 'Get Verified', desc: 'Our dedicated team reviews and verifies your profile within 48 hours. You\'ll receive an email notification.', icon: CheckCircle, color: 'violet' },
              { step: '03', title: 'Start Volunteering', desc: 'Once approved, dive into our programs. Mentor students, attend sessions, and make real impact.', icon: Zap, color: 'cyan' },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 180}>
                <div className={`relative flex gap-8 mb-12 last:mb-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className={`absolute left-6 md:left-1/2 top-6 w-3 h-3 rounded-full -translate-x-1.5 md:-translate-x-1.5 ${
                    item.color === 'emerald' ? 'bg-emerald-400' :
                    item.color === 'violet' ? 'bg-violet-400' : 'bg-cyan-400'
                  } ring-4 ring-surface-alt z-10`} />

                  <div className={`ml-16 md:ml-0 flex-1 ${i % 2 === 1 ? 'md:text-right md:pl-0 md:pr-16' : 'md:pl-16'}`}>
                    <div className={`inline-block p-6 rounded-2xl border card-hover ${
                      item.color === 'emerald' ? 'border-emerald-500/15 bg-emerald-950/20' :
                      item.color === 'violet' ? 'border-violet-500/15 bg-violet-950/20' :
                      'border-cyan-500/15 bg-cyan-950/20'
                    }`}>
                      <span className={`text-xs font-mono tracking-widest ${
                        item.color === 'emerald' ? 'text-emerald-500' :
                        item.color === 'violet' ? 'text-violet-500' : 'text-cyan-500'
                      }`}>
                        STEP_{item.step}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2 mb-3">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-20 md:py-32" style={{ background: '#0a0f1e' }}>
        <div className="page-container">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="section-badge">Testimonials</span>
              <h2 className="section-title mt-3">Voices From Our Community</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="card-elevated p-6 card-hover h-full flex flex-col border border-white/5 hover:border-emerald-500/20 transition-colors">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.college}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: '#060b16' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[80px]" />
        </div>

        <div className="relative page-container text-center">
          <Reveal>
            <span className="section-badge">Join Now</span>
            <h2 className="section-title mt-4 mb-4 text-white text-4xl md:text-5xl font-bold">
              Ready to Make a{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Difference?
              </span>
            </h2>
            <p className="text-slate-400 text-base mb-10 max-w-xl mx-auto">
              Thousands of passionate volunteers are already changing student lives. Your journey starts with one step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="btn-primary text-base px-10 py-4 rounded-xl animate-pulse-glow"
              >
                Register as Volunteer
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn-outline text-base px-10 py-4 rounded-xl"
              >
                Login to Dashboard
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
