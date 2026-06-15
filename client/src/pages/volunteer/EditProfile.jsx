import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, MapPin, Building, GraduationCap,
  Clock, Link2, GitBranch, Save, ArrowLeft, Heart, Check,
} from 'lucide-react';
import volunteerService from '../../services/volunteerService';
import Loader from '../../components/common/Loader';
import { INDIAN_STATES, SKILLS_OPTIONS, AREAS_OF_INTEREST, YEAR_OPTIONS, HOURS_OPTIONS } from '../../utils/constants';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const selectedSkills = watch('skills', []);
  const selectedAreas = watch('areasOfInterest', []);
  const motivation = watch('motivation', '');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await volunteerService.getProfile();
        if (res.success) {
          const p = res.data;
          setProfile(p);
          Object.keys(p).forEach((key) => {
            if (key !== '_id' && key !== '__v' && key !== 'userId' && key !== 'statusHistory') {
              setValue(key, p[key]);
            }
          });
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const toggleCheckbox = (field, value) => {
    const current = getValues(field) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await volunteerService.updateProfile(data);
      if (res.success) {
        toast.success('Profile updated successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      <nav className="bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="page-container flex items-center justify-between h-14 sm:h-16">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm sm:text-base">
            <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Back to Dashboard</span><span className="sm:hidden">Back</span>
          </button>
          <span className="font-semibold text-text-primary text-sm sm:text-base">Edit Profile</span>
          <div className="w-16 sm:w-24" />
        </div>
      </nav>

      <div className="page-container py-6 sm:py-8 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info */}
          <div className="card-elevated p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Full Name</label>
                <input {...register('fullName', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })} className={`input-field ${errors.fullName ? 'error' : ''}`} />
                {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="input-label">Email (cannot be changed)</label>
                <input value={profile?.email || ''} disabled className="input-field bg-gray-100 text-text-secondary cursor-not-allowed" />
              </div>
              <div>
                <label className="input-label">Phone</label>
                <input {...register('phone', { required: 'Required', pattern: { value: /^\d{10}$/, message: '10 digits required' } })} className={`input-field ${errors.phone ? 'error' : ''}`} />
                {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="input-label">City</label>
                <input {...register('city', { required: 'Required' })} className={`input-field ${errors.city ? 'error' : ''}`} />
                {errors.city && <p className="text-error text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">State</label>
                <select {...register('state', { required: 'Required' })} className={`input-field ${errors.state ? 'error' : ''}`}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="card-elevated p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" /> Academic Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">College</label>
                <input {...register('college', { required: 'Required' })} className={`input-field ${errors.college ? 'error' : ''}`} />
              </div>
              <div>
                <label className="input-label">Degree</label>
                <input {...register('degree', { required: 'Required' })} className={`input-field ${errors.degree ? 'error' : ''}`} />
              </div>
              <div>
                <label className="input-label">Year of Study</label>
                <select {...register('yearOfStudy', { required: 'Required' })} className="input-field">
                  {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card-elevated p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> Volunteer Information
            </h3>

            <div className="mb-6">
              <label className="input-label">Skills</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {SKILLS_OPTIONS.map((skill) => (
                  <label key={skill} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm ${selectedSkills?.includes(skill) ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-text-secondary'}`}>
                    <input type="checkbox" checked={selectedSkills?.includes(skill) || false} onChange={() => toggleCheckbox('skills', skill)} className="sr-only" />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedSkills?.includes(skill) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                      {selectedSkills?.includes(skill) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="input-label">Areas of Interest</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {AREAS_OF_INTEREST.map((area) => (
                  <label key={area} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm ${selectedAreas?.includes(area) ? 'border-secondary bg-secondary/5 text-secondary' : 'border-gray-200 text-text-secondary'}`}>
                    <input type="checkbox" checked={selectedAreas?.includes(area) || false} onChange={() => toggleCheckbox('areasOfInterest', area)} className="sr-only" />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedAreas?.includes(area) ? 'bg-secondary border-secondary' : 'border-gray-300'}`}>
                      {selectedAreas?.includes(area) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {area}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="input-label">Motivation</label>
              <textarea {...register('motivation', { required: 'Required', minLength: { value: 50, message: 'Min 50 chars' } })} rows={4} className="input-field resize-none" />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${(motivation?.length || 0) >= 50 ? 'text-success' : 'text-text-secondary'}`}>{motivation?.length || 0}/50 min</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="input-label">Available Hours</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {HOURS_OPTIONS.map((option) => (
                  <label key={option} className={`flex items-center justify-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${watch('availableHours') === option ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-text-secondary'}`}>
                    <input type="radio" {...register('availableHours')} value={option} className="sr-only" />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">LinkedIn URL</label>
                <input {...register('linkedinUrl')} className="input-field" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="input-label">GitHub URL</label>
                <input {...register('githubUrl')} className="input-field" placeholder="https://github.com/..." />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 form-actions-sticky sm:static">
            <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 text-text-secondary font-medium rounded-xl hover:bg-gray-100 transition-colors text-center">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary rounded-xl px-8 py-3 disabled:opacity-50 justify-center">
              {saving ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin-slow" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
