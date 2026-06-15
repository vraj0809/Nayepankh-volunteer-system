import { Link } from 'react-router-dom';
import { Zap, Mail, MapPin, Phone, Globe, MessageCircle, Camera, Link2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="footer" className="border-t border-white/5" style={{ background: '#060b16' }}>
      <div className="page-container py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold">NayePankh</span>
                <span className="text-[10px] block font-mono text-emerald-400 tracking-widest">FOUNDATION</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              Giving wings to dreams. Empowering underprivileged students with
              mentorship, skill development, and real-world opportunities.
            </p>
            <div className="flex gap-2">
              {[Globe, MessageCircle, Camera, Link2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:border-emerald-500/30 hover:text-emerald-400 text-slate-500 transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {['Home', 'About Us', 'Our Mission', 'Programs', 'Contact'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-slate-500 text-sm hover:text-slate-200 transition-colors py-0.5 inline-block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-[10px] font-mono text-violet-400 uppercase tracking-widest mb-5">Get Involved</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Volunteer with Us', to: '/register' },
                { label: 'Login Portal', to: '/login' },
                { label: 'Mentorship Program', to: '/' },
                { label: 'Donate', to: '/' },
                { label: 'Partner with Us', to: '/' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-slate-500 text-sm hover:text-slate-200 transition-colors py-0.5 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-5">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-500 text-sm leading-relaxed">
                  Sector 62, Noida, Uttar Pradesh, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <a href="mailto:contact@nayepankh.org" className="text-slate-500 text-sm hover:text-emerald-400 transition-colors">
                  contact@nayepankh.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-slate-500 text-sm hover:text-emerald-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-slate-600 text-xs font-mono">
            © 2025 NayePankh Foundation. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs font-mono flex items-center gap-1">
            Built with <span className="text-rose-500">♥</span> for a better tomorrow
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
