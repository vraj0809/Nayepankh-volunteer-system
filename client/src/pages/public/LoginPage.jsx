import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, ArrowLeft, Terminal } from 'lucide-react';
import { loginSchema } from '../../schemas/loginSchema';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        toast.success(`Welcome back, ${res.data.user.name}!`);
        if (res.data.user.role === 'admin') navigate('/admin/dashboard');
        else navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0f1e' }}>
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 relative flex-col justify-center p-12 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #060b16 0%, #0f1629 50%, #130d2a 100%)' }}>
        {/* Grid pattern */}
        <div className="absolute inset-0 hero-pattern opacity-60" />
        {/* Orbs */}
        <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-violet-600/5 blur-3xl" />
        {/* Animated border line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-14 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-base block">NayePankh</span>
              <span className="text-emerald-400 text-xs font-mono tracking-widest">FOUNDATION</span>
            </div>
          </Link>

          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-mono">volunteer_portal_v2</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight">
            Welcome back to<br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              making a difference.
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            Access your volunteer dashboard, track your application, and continue
            your journey of empowering students across India.
          </p>

          <div className="space-y-4">
            {[
              { label: 'Real-time application status' },
              { label: 'Profile management & skills' },
              { label: 'Community & volunteer network' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-slate-300 text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Admin hint */}
          <div className="mt-12 p-4 rounded-xl border border-white/5 bg-white/3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400 text-xs font-semibold">Admin Access</span>
            </div>
            <p className="text-slate-500 text-xs">Use your admin credentials to access the control panel.</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative"
        style={{ background: '#0f1629' }}>
        {/* Subtle bg blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-600/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-8 lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="card-elevated p-7 sm:p-9 border border-white/6">
            {/* Top border gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent rounded-t-xl" />

            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </Link>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sign In</h1>
              <p className="text-slate-400 text-sm mt-1">Access your NayePankh account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register('email')}
                    type="email"
                    className={`input-field input-icon-left ${errors.email ? 'error' : ''}`}
                    placeholder="your.email@example.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className={`input-field input-icon-left input-icon-right ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center py-3.5 text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin-slow" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-slate-400 text-sm">
                No account yet?{' '}
                <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                  Join as Volunteer
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-slate-600 text-xs mt-5 font-mono">
            SECURED · ENCRYPTED · TRUSTED
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
