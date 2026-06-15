import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Zap, User, Mail, Lock, Phone, MapPin, Building,
  GraduationCap, Lightbulb, Clock, Link2, GitBranch,
  ChevronRight, ChevronLeft, Check, Eye, EyeOff, ArrowRight, ArrowLeft,
} from 'lucide-react';
import { registerSchema } from '../../schemas/registerSchema';
import { useAuth } from '../../hooks/useAuth';
import { INDIAN_STATES, SKILLS_OPTIONS, AREAS_OF_INTEREST, YEAR_OPTIONS, HOURS_OPTIONS } from '../../utils/constants';
import { getPasswordStrength } from '../../utils/validators';

const steps = [
  { id: 1, title: 'Personal Info', icon: User, color: 'emerald' },
  { id: 2, title: 'Academic Info', icon: GraduationCap, color: 'violet' },
  { id: 3, title: 'Volunteer Info', icon: Zap, color: 'cyan' },
];

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register, handleSubmit, watch, trigger,
    formState: { errors }, setValue, getValues,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '', email: '', password: '', confirmPassword: '',
      phone: '', city: '', state: '',
      college: '', degree: '', yearOfStudy: '',
      skills: [], areasOfInterest: [], motivation: '',
      availableHours: '', linkedinUrl: '', githubUrl: '',
    },
  });

  const password = watch('password', '');
  const motivation = watch('motivation', '');
  const selectedSkills = watch('skills', []);
  const selectedAreas = watch('areasOfInterest', []);
  const passwordStrength = getPasswordStrength(password);

  const step1Fields = ['fullName', 'email', 'password', 'confirmPassword', 'phone', 'city', 'state'];
  const step2Fields = ['college', 'degree', 'yearOfStudy'];

  const handleNext = async () => {
    const fields = currentStep === 1 ? step1Fields : step2Fields;
    const valid = await trigger(fields);
    if (valid) setCurrentStep((p) => p + 1);
  };

  const handlePrev = () => setCurrentStep((p) => p - 1);

  const toggleCheckbox = (field, value) => {
    const current = getValues(field) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = data;
      const res = await registerUser(submitData);
      if (res.success) setShowSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0] || 'Registration failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success Screen ── */
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0f1e' }}>
        <div className="max-w-md w-full text-center animate-fade-in-up">
          <div className="card-elevated p-10 border border-emerald-500/20">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-t-xl" />
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-6 animate-pulse-glow">
              <Check className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Application Submitted!</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Your volunteer application has been received. Our team will review it within 48 hours.
              You'll be notified via email.
            </p>
            <Link to="/login" className="btn-primary w-full justify-center py-3.5 rounded-xl">
              Go to Login <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs font-mono text-emerald-500/50 mt-5 tracking-widest">APPLICATION_ID: {Math.random().toString(36).slice(2,10).toUpperCase()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0f1e' }}>
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 relative flex-col justify-center p-12 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #060b16 0%, #0f1629 60%, #130d2a 100%)' }}>
        <div className="absolute inset-0 hero-pattern opacity-50" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/30 to-transparent" />
        <div className="absolute top-1/3 right-0 w-48 h-48 rounded-full bg-violet-600/5 blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm block">NayePankh Foundation</span>
              <span className="text-violet-400 text-xs font-mono tracking-widest">VOLUNTEER_PORTAL</span>
            </div>
          </Link>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight">
            Join Our Mission to
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Empower Students.
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            India's growing volunteer community is waiting for you.
            Help make education and opportunity accessible to all.
          </p>

          <div className="space-y-3 mb-10">
            {[
              'Gain real mentoring experience',
              'Build leadership skills',
              'Create meaningful social impact',
              'Join 500+ active volunteers',
              'Earn a volunteering certificate',
            ].map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-violet-400" />
                </div>
                <span className="text-slate-300 text-sm">{b}</span>
              </div>
            ))}
          </div>

          <blockquote className="border-l-2 border-violet-500/50 pl-4">
            <p className="text-slate-400 italic text-sm">
              "The best way to find yourself is to lose yourself in the service of others."
            </p>
            <cite className="text-slate-600 text-xs mt-2 block">— Mahatma Gandhi</cite>
          </blockquote>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 overflow-y-auto" style={{ background: '#0f1629' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
          {/* Mobile logo */}
          <div className="lg:hidden mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">NayePankh Foundation</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-slate-400 text-sm mt-1">Register as a volunteer — 3 simple steps</p>
          </div>

          {/* ── Step Indicator ── */}
          <div className="mb-8">
            <div className="flex items-center">
              {steps.map((step, i) => {
                const done = currentStep > step.id;
                const active = currentStep === step.id;
                const colors = {
                  emerald: { active: 'bg-emerald-500 text-white shadow-emerald-500/30', done: 'bg-emerald-500/80 text-white', inactive: 'bg-surface-elevated text-slate-500 border border-white/8', line: done ? 'bg-emerald-500' : 'bg-white/8' },
                  violet: { active: 'bg-violet-500 text-white shadow-violet-500/30', done: 'bg-violet-500/80 text-white', inactive: 'bg-surface-elevated text-slate-500 border border-white/8', line: done ? 'bg-violet-500' : 'bg-white/8' },
                  cyan: { active: 'bg-cyan-500 text-white shadow-cyan-500/30', done: 'bg-cyan-500/80 text-white', inactive: 'bg-surface-elevated text-slate-500 border border-white/8', line: done ? 'bg-cyan-500' : 'bg-white/8' },
                };
                const c = colors[step.color];
                return (
                  <div key={step.id} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-lg ${done ? c.done : active ? c.active : c.inactive}`}>
                        {done ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${active ? 'text-white' : 'text-slate-500'}`}>{step.title}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded-full transition-all ${c.line}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* ── STEP 1 ── */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2 font-mono">
                  <span className="text-emerald-600">{'>'}</span> Personal Information
                </h3>
                <div>
                  <label className="input-label">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('fullName')} className={`input-field input-icon-left ${errors.fullName ? 'error' : ''}`} placeholder="Your full name" />
                  </div>
                  {errors.fullName && <p className="text-rose-400 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="input-label">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('email')} type="email" className={`input-field input-icon-left ${errors.email ? 'error' : ''}`} placeholder="your.email@example.com" />
                  </div>
                  {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="input-label">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`input-field input-icon-left input-icon-right ${errors.password ? 'error' : ''}`}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 font-mono">Strength</span>
                        <span style={{ color: passwordStrength.color }} className="font-semibold">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${passwordStrength.strength}%`, backgroundColor: passwordStrength.color }} />
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="input-label">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      className={`input-field input-icon-left input-icon-right ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Re-enter your password"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-rose-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
                <div>
                  <label className="input-label">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('phone')} className={`input-field input-icon-left ${errors.phone ? 'error' : ''}`} placeholder="10-digit mobile number" maxLength={10} />
                  </div>
                  {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">City *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input {...register('city')} className={`input-field input-icon-left ${errors.city ? 'error' : ''}`} placeholder="Your city" />
                    </div>
                    {errors.city && <p className="text-rose-400 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">State *</label>
                    <select {...register('state')} className={`input-field ${errors.state ? 'error' : ''}`}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-rose-400 text-xs mt-1">{errors.state.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-base font-semibold text-violet-400 flex items-center gap-2 font-mono">
                  <span className="text-violet-600">{'>'}</span> Academic Information
                </h3>
                <div>
                  <label className="input-label">College / University *</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('college')} className={`input-field input-icon-left ${errors.college ? 'error' : ''}`} placeholder="Your college or university name" />
                  </div>
                  {errors.college && <p className="text-rose-400 text-xs mt-1">{errors.college.message}</p>}
                </div>
                <div>
                  <label className="input-label">Degree / Course *</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input {...register('degree')} className={`input-field input-icon-left ${errors.degree ? 'error' : ''}`} placeholder="e.g. B.Tech, BCA, MBA" />
                  </div>
                  {errors.degree && <p className="text-rose-400 text-xs mt-1">{errors.degree.message}</p>}
                </div>
                <div>
                  <label className="input-label">Year of Study *</label>
                  <select {...register('yearOfStudy')} className={`input-field ${errors.yearOfStudy ? 'error' : ''}`}>
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.yearOfStudy && <p className="text-rose-400 text-xs mt-1">{errors.yearOfStudy.message}</p>}
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-base font-semibold text-cyan-400 flex items-center gap-2 font-mono">
                  <span className="text-cyan-600">{'>'}</span> Volunteer Information
                </h3>

                {/* Skills */}
                <div>
                  <label className="input-label">Skills * (select all that apply)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {SKILLS_OPTIONS.map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${
                          selectedSkills.includes(skill)
                            ? 'border-emerald-500/40 bg-emerald-500/8 text-emerald-300'
                            : 'border-white/8 hover:border-white/15 text-slate-400'
                        }`}
                      >
                        <input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggleCheckbox('skills', skill)} className="sr-only" />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedSkills.includes(skill) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                          {selectedSkills.includes(skill) && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        {skill}
                      </label>
                    ))}
                  </div>
                  {errors.skills && <p className="text-rose-400 text-xs mt-1">{errors.skills.message}</p>}
                </div>

                {/* Areas of Interest */}
                <div>
                  <label className="input-label">Areas of Interest * (select all that apply)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {AREAS_OF_INTEREST.map((area) => (
                      <label
                        key={area}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm ${
                          selectedAreas.includes(area)
                            ? 'border-violet-500/40 bg-violet-500/8 text-violet-300'
                            : 'border-white/8 hover:border-white/15 text-slate-400'
                        }`}
                      >
                        <input type="checkbox" checked={selectedAreas.includes(area)} onChange={() => toggleCheckbox('areasOfInterest', area)} className="sr-only" />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedAreas.includes(area) ? 'bg-violet-500 border-violet-500' : 'border-slate-600'}`}>
                          {selectedAreas.includes(area) && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        {area}
                      </label>
                    ))}
                  </div>
                  {errors.areasOfInterest && <p className="text-rose-400 text-xs mt-1">{errors.areasOfInterest.message}</p>}
                </div>

                {/* Motivation */}
                <div>
                  <label className="input-label">Why do you want to volunteer? *</label>
                  <textarea
                    {...register('motivation')}
                    rows={4}
                    className={`input-field resize-none ${errors.motivation ? 'error' : ''}`}
                    placeholder="Share your motivation (minimum 50 characters)..."
                  />
                  <div className="flex justify-between mt-1">
                    {errors.motivation ? <p className="text-rose-400 text-xs">{errors.motivation.message}</p> : <span />}
                    <span className={`text-xs font-mono ${motivation.length >= 50 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {motivation.length}/50
                    </span>
                  </div>
                </div>

                {/* Available Hours */}
                <div>
                  <label className="input-label">Available Hours per Week *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    {HOURS_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm font-medium ${
                          watch('availableHours') === option
                            ? 'border-cyan-500/40 bg-cyan-500/8 text-cyan-300'
                            : 'border-white/8 hover:border-white/15 text-slate-400'
                        }`}
                      >
                        <input type="radio" {...register('availableHours')} value={option} className="sr-only" />
                        <Clock className="w-4 h-4" />
                        {option}
                      </label>
                    ))}
                  </div>
                  {errors.availableHours && <p className="text-rose-400 text-xs mt-1">{errors.availableHours.message}</p>}
                </div>

                {/* Optional links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">LinkedIn URL (Optional)</label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input {...register('linkedinUrl')} className={`input-field input-icon-left ${errors.linkedinUrl ? 'error' : ''}`} placeholder="https://linkedin.com/in/..." />
                    </div>
                    {errors.linkedinUrl && <p className="text-rose-400 text-xs mt-1">{errors.linkedinUrl.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">GitHub URL (Optional)</label>
                    <div className="relative">
                      <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input {...register('githubUrl')} className={`input-field input-icon-left ${errors.githubUrl ? 'error' : ''}`} placeholder="https://github.com/..." />
                    </div>
                    {errors.githubUrl && <p className="text-rose-400 text-xs mt-1">{errors.githubUrl.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-white/5 form-actions-sticky sm:static">
              {currentStep > 1 ? (
                <button type="button" onClick={handlePrev} className="flex items-center justify-center gap-2 px-6 py-3 text-slate-400 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-colors text-sm">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {currentStep < 3 ? (
                <button type="button" onClick={handleNext} className="btn-primary rounded-xl px-8 py-3 w-full sm:w-auto text-sm">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary rounded-xl px-8 py-3 w-full sm:w-auto text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin-slow" />
                      Submitting...
                    </>
                  ) : (
                    <>Submit Application <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
