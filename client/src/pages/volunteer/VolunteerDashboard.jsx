import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, LogOut, Edit, User, Mail, Phone, MapPin, Building,
  GraduationCap, Clock, Link2, GitBranch, Calendar, MessageSquare,
  Terminal, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import volunteerService from '../../services/volunteerService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/volunteer/StatusBadge';
import { formatDate, getInitials } from '../../utils/formatters';

const VolunteerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await volunteerService.getProfile();
        if (res.success) setProfile(res.data);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <Loader size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  const statusConfig = {
    pending: {
      border: 'border-amber-500/20',
      bg: 'from-amber-950/30 to-transparent',
      badge: 'text-amber-400 bg-amber-500/10',
      msg: 'Your application is under review. We\'ll notify you within 48 hours.',
    },
    approved: {
      border: 'border-emerald-500/20',
      bg: 'from-emerald-950/30 to-transparent',
      badge: 'text-emerald-400 bg-emerald-500/10',
      msg: 'You\'re an approved volunteer! Start making a difference today.',
    },
    rejected: {
      border: 'border-rose-500/20',
      bg: 'from-rose-950/30 to-transparent',
      badge: 'text-rose-400 bg-rose-500/10',
      msg: 'Your application was not approved this time. Check admin note for details.',
    },
  };
  const sc = statusConfig[profile?.status] || statusConfig.pending;

  return (
    <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
      {/* ── Top Navbar ── */}
      <nav
        className="border-b border-white/5 sticky top-0 z-40"
        style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="page-container flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">NayePankh</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs text-slate-400 hidden sm:block">
              Welcome,{' '}
              <span className="font-semibold text-white">{user?.name?.split(' ')[0]}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl border border-transparent hover:border-rose-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="page-container py-6 sm:py-8 max-w-5xl">
        {/* Status banner */}
        <div className={`rounded-2xl p-5 sm:p-6 mb-6 border ${sc.border} bg-gradient-to-br ${sc.bg}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">
                Welcome back, {profile?.fullName?.split(' ')[0]}! 👋
              </h2>
              <p className="text-slate-400 text-sm">{sc.msg}</p>
            </div>
            <StatusBadge status={profile?.status} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
          {/* ── Left Column ── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <div className="card-elevated p-5 sm:p-6 text-center border border-white/5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent rounded-t-xl" />
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-emerald-500/20">
                {getInitials(profile?.fullName)}
              </div>
              <h3 className="text-base font-bold text-white">{profile?.fullName}</h3>
              <p className="text-slate-400 text-sm">{profile?.email}</p>
              <p className="text-slate-500 text-xs mt-1">{profile?.college}</p>

              <div className="mt-4 flex justify-center">
                <StatusBadge status={profile?.status} />
              </div>

              <div className="mt-3 text-xs text-slate-500 flex items-center justify-center gap-1.5 font-mono">
                <Calendar className="w-3 h-3" />
                Joined {formatDate(profile?.registeredAt)}
              </div>

              {profile?.adminNote && profile?.status === 'rejected' && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/8 border border-rose-500/20 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
                    <MessageSquare className="w-3 h-3" /> Admin Note
                  </div>
                  <p className="text-xs text-rose-300">{profile.adminNote}</p>
                </div>
              )}

              <Link
                to="/dashboard/edit"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-400 border border-emerald-500/25 rounded-xl hover:bg-emerald-500/8 hover:border-emerald-500/40 transition-all"
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </Link>
            </div>

            {/* Skills */}
            <div className="card-elevated p-4 sm:p-5 border border-white/5">
              <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {(profile?.skills || []).map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-emerald-500/8 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/15">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Personal Details */}
            <div className="card-elevated p-5 sm:p-6 border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" /> Personal Details
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: User, label: 'Full Name', value: profile?.fullName },
                  { icon: Mail, label: 'Email', value: profile?.email },
                  { icon: Phone, label: 'Phone', value: profile?.phone },
                  { icon: MapPin, label: 'Location', value: `${profile?.city}, ${profile?.state}` },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <item.icon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-mono">{item.label}</p>
                      <p className="text-sm font-medium text-slate-200">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Details */}
            <div className="card-elevated p-5 sm:p-6 border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-violet-400" /> Academic Details
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Building, label: 'College', value: profile?.college },
                  { icon: GraduationCap, label: 'Degree', value: profile?.degree },
                  { icon: Calendar, label: 'Year', value: profile?.yearOfStudy },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <item.icon className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-mono">{item.label}</p>
                      <p className="text-sm font-medium text-slate-200">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteer Preferences */}
            <div className="card-elevated p-5 sm:p-6 border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" /> Volunteer Preferences
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-mono mb-2">Areas of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.areasOfInterest || []).map((area) => (
                      <span key={area} className="px-2.5 py-1 bg-violet-500/8 text-violet-300 rounded-lg text-xs border border-violet-500/15">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-mono">Available Hours/Week</p>
                    <p className="text-sm font-medium text-slate-200">{profile?.availableHours}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono mb-2">Motivation</p>
                  <p className="text-sm text-slate-300 bg-white/3 p-3 rounded-xl leading-relaxed border border-white/5">
                    {profile?.motivation}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(profile?.linkedinUrl || profile?.githubUrl) && (
              <div className="card-elevated p-5 sm:p-6 border border-white/5">
                <h4 className="text-sm font-semibold text-white mb-4">Social Links</h4>
                <div className="flex flex-wrap gap-3">
                  {profile?.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/8 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-medium hover:bg-blue-500/15 transition-colors">
                      <Link2 className="w-4 h-4" /> LinkedIn <ChevronRight className="w-3 h-3" />
                    </a>
                  )}
                  {profile?.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                      <GitBranch className="w-4 h-4" /> GitHub <ChevronRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
