import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Building,
  GraduationCap, Heart, Clock, Link2, GitBranch,
  CheckCircle, XCircle, Trash2, Calendar, MessageSquare,
  Save,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/volunteer/StatusBadge';
import Loader from '../../components/common/Loader';
import adminService from '../../services/adminService';
import { formatDate, getInitials } from '../../utils/formatters';

const VolunteerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getVolunteerById(id);
        if (res.success) {
          setVolunteer(res.data);
          setAdminNote(res.data.adminNote || '');
        }
      } catch (err) {
        toast.error('Volunteer not found');
        navigate('/admin/volunteers');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleStatusChange = async (status) => {
    setActionLoading(status);
    try {
      const res = await adminService.updateVolunteerStatus(id, status, adminNote);
      if (res.success) {
        setVolunteer(res.data);
        toast.success(`Volunteer ${status} successfully`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this volunteer? This cannot be undone.')) return;
    setActionLoading('delete');
    try {
      await adminService.deleteVolunteer(id);
      toast.success('Volunteer deleted');
      navigate('/admin/volunteers');
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Volunteer Details">
        <Loader size="lg" text="Loading volunteer..." />
      </AdminLayout>
    );
  }

  const v = volunteer;

  return (
    <AdminLayout title={v?.fullName || 'Volunteer Details'} subtitle="Review and manage volunteer application">
      <button onClick={() => navigate('/admin/volunteers')} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-4 sm:mb-6 text-sm sm:text-base">
        <ArrowLeft className="w-5 h-5" /> Back to Volunteers
      </button>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Profile + Actions */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="card-elevated p-4 sm:p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {getInitials(v?.fullName)}
                </div>
                <h2 className="text-xl font-bold text-text-primary">{v?.fullName}</h2>
                <p className="text-text-secondary text-sm">{v?.email}</p>
                <div className="mt-3"><StatusBadge status={v?.status} /></div>
                <p className="text-xs text-text-secondary mt-2">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Registered {formatDate(v?.registeredAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="card-elevated p-4 sm:p-6 space-y-3">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Actions</h3>
                {v?.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange('approved')}
                    disabled={!!actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {actionLoading === 'approved' ? 'Approving...' : 'Approve Volunteer'}
                  </button>
                )}
                {v?.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    disabled={!!actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    {actionLoading === 'rejected' ? 'Rejecting...' : 'Reject Volunteer'}
                  </button>
                )}
                {v?.status !== 'pending' && (
                  <button
                    onClick={() => handleStatusChange('pending')}
                    disabled={!!actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-warning text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" /> Reset to Pending
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={!!actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 text-error rounded-xl font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {actionLoading === 'delete' ? 'Deleting...' : 'Delete Volunteer'}
                </button>
              </div>

              {/* Admin Note */}
              <div className="card-elevated p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Admin Note
                </h3>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="input-field resize-none text-sm"
                  placeholder="Add a note (will be saved with status change)..."
                />
                <p className="text-xs text-text-secondary mt-2">Note is saved when you approve/reject the volunteer.</p>
              </div>

              {/* Status Timeline */}
              {v?.statusHistory && v.statusHistory.length > 0 && (
                <div className="card-elevated p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Status Timeline</h3>
                  <div className="space-y-4">
                    {v.statusHistory.map((h, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${h.status === 'approved' ? 'bg-success' : h.status === 'rejected' ? 'bg-error' : 'bg-warning'}`} />
                          {i < v.statusHistory.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium text-text-primary capitalize">{h.status}</p>
                          {h.note && <p className="text-xs text-text-secondary">{h.note}</p>}
                          <p className="text-xs text-text-secondary mt-1">{formatDate(h.changedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal */}
              <div className="card-elevated p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Personal Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: User, label: 'Full Name', value: v?.fullName },
                    { icon: Mail, label: 'Email', value: v?.email },
                    { icon: Phone, label: 'Phone', value: v?.phone },
                    { icon: MapPin, label: 'Location', value: `${v?.city}, ${v?.state}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-alt">
                      <item.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-text-secondary">{item.label}</p>
                        <p className="text-sm font-medium text-text-primary">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic */}
              <div className="card-elevated p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" /> Academic Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { label: 'College', value: v?.college },
                    { label: 'Degree', value: v?.degree },
                    { label: 'Year', value: v?.yearOfStudy },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-surface-alt">
                      <p className="text-xs text-text-secondary">{item.label}</p>
                      <p className="text-sm font-medium text-text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Volunteer Info */}
              <div className="card-elevated p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" /> Volunteer Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-text-secondary mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(v?.skills || []).map((s) => (
                        <span key={s} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-2">Areas of Interest</p>
                    <div className="flex flex-wrap gap-2">
                      {(v?.areasOfInterest || []).map((a) => (
                        <span key={a} className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-xs font-medium">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-alt">
                    <p className="text-xs text-text-secondary">Available Hours</p>
                    <p className="text-sm font-medium text-text-primary">{v?.availableHours}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Motivation</p>
                    <p className="text-sm text-text-primary bg-surface-alt p-4 rounded-xl leading-relaxed">{v?.motivation}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(v?.linkedinUrl || v?.githubUrl) && (
                <div className="card-elevated p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Social Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {v?.linkedinUrl && (
                      <a href={v.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                        <Link2 className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                    {v?.githubUrl && (
                      <a href={v.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                        <GitBranch className="w-4 h-4" /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
    </AdminLayout>
  );
};

export default VolunteerDetail;
