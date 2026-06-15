import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search, Eye, CheckCircle, XCircle, Trash2,
  ChevronLeft, ChevronRight, X, Users,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import VolunteerMobileCard from '../../components/admin/VolunteerMobileCard';
import StatusBadge from '../../components/volunteer/StatusBadge';
import Loader from '../../components/common/Loader';
import useVolunteers from '../../hooks/useVolunteers';
import adminService from '../../services/adminService';
import { formatShortDate, truncateText } from '../../utils/formatters';
import { YEAR_OPTIONS } from '../../utils/constants';

const AllVolunteers = () => {
  const [searchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status');

  const {
    volunteers, total, page, totalPages, loading,
    filters, setPage, updateFilters, clearFilters, refetch,
  } = useVolunteers(statusFromUrl ? { status: statusFromUrl } : {});

  const [selected, setSelected] = useState([]);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    if (statusFromUrl) {
      updateFilters({ status: statusFromUrl });
    }
  }, [statusFromUrl]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === volunteers.length) {
      setSelected([]);
    } else {
      setSelected(volunteers.map((v) => v._id));
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionLoading(id);
    try {
      await adminService.updateVolunteerStatus(id, status);
      toast.success(`Volunteer ${status} successfully`);
      refetch();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer? This action cannot be undone.')) return;
    setActionLoading(id);
    try {
      await adminService.deleteVolunteer(id);
      toast.success('Volunteer deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setActionLoading('');
    }
  };

  const handleBulkAction = async (status) => {
    if (selected.length === 0) return toast.error('Select at least one volunteer');
    if (!window.confirm(`${status === 'approved' ? 'Approve' : 'Reject'} ${selected.length} selected volunteers?`)) return;
    setActionLoading('bulk');
    try {
      await Promise.all(selected.map((id) => adminService.updateVolunteerStatus(id, status)));
      toast.success(`${selected.length} volunteers ${status}`);
      setSelected([]);
      refetch();
    } catch (err) {
      toast.error('Bulk action failed');
    } finally {
      setActionLoading('');
    }
  };

  const statusTitle = statusFromUrl
    ? `${statusFromUrl.charAt(0).toUpperCase() + statusFromUrl.slice(1)} Volunteers`
    : 'All Volunteers';

  return (
    <AdminLayout title={statusTitle} subtitle={`${total} total volunteers`}>
      <div className="card-elevated p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="input-field input-icon-left"
              placeholder="Search by name or email..."
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.yearOfStudy}
            onChange={(e) => updateFilters({ yearOfStudy: e.target.value })}
            className="input-field"
          >
            <option value="">All Years</option>
            {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <input
            value={filters.city}
            onChange={(e) => updateFilters({ city: e.target.value })}
            className="input-field w-full sm:w-48"
            placeholder="Filter by city..."
          />
          <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors self-end sm:self-auto">
            <X className="w-4 h-4" /> Clear Filters
          </button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 sm:p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <span className="text-sm font-medium text-primary">{selected.length} volunteer(s) selected</span>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleBulkAction('approved')} disabled={actionLoading === 'bulk'} className="flex-1 sm:flex-none px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50">
              Approve
            </button>
            <button onClick={() => handleBulkAction('rejected')} disabled={actionLoading === 'bulk'} className="flex-1 sm:flex-none px-4 py-2 bg-error text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
              Reject
            </button>
            <button onClick={() => setSelected([])} className="flex-1 sm:flex-none px-4 py-2 text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card-elevated overflow-hidden">
        {loading ? (
          <Loader text="Loading volunteers..." />
        ) : volunteers.length === 0 ? (
          <div className="p-12 sm:p-16 text-center">
            <Users className="w-14 h-14 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-text-secondary text-base sm:text-lg font-medium">No volunteers found</p>
            <p className="text-text-secondary text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="lg:hidden">
              {volunteers.map((v, i) => (
                <VolunteerMobileCard
                  key={v._id}
                  volunteer={v}
                  index={i}
                  page={page}
                  selected={selected.includes(v._id)}
                  onToggleSelect={() => toggleSelect(v._id)}
                  onApprove={(id) => handleStatusChange(id, 'approved')}
                  onReject={(id) => handleStatusChange(id, 'rejected')}
                  onDelete={handleDelete}
                  actionLoading={actionLoading}
                />
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block table-responsive">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-surface-alt">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" checked={selected.length === volunteers.length && volunteers.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300" />
                    </th>
                    {['#', 'Name', 'Email', 'Phone', 'College', 'City', 'Skills', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {volunteers.map((v, i) => (
                    <tr key={v._id} className="hover:bg-surface-alt transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(v._id)} onChange={() => toggleSelect(v._id)} className="w-4 h-4 rounded border-gray-300" />
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{(page - 1) * 10 + i + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-text-primary">{v.fullName}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{v.email}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{v.phone}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{truncateText(v.college, 20)}</td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{v.city}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(v.skills || []).slice(0, 2).map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium">{s}</span>
                          ))}
                          {(v.skills || []).length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-text-secondary rounded text-[10px] font-medium">
                              +{v.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                      <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">{formatShortDate(v.registeredAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/admin/volunteers/${v._id}`} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {v.status !== 'approved' && (
                            <button onClick={() => handleStatusChange(v._id, 'approved')} disabled={actionLoading === v._id} className="p-1.5 text-success hover:bg-success/10 rounded-lg transition-colors" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {v.status !== 'rejected' && (
                            <button onClick={() => handleStatusChange(v._id, 'rejected')} disabled={actionLoading === v._id} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(v._id)} disabled={actionLoading === v._id} className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-error rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-text-secondary text-center sm:text-left">
                Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'gradient-primary text-white'
                          : 'text-text-secondary hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-text-secondary text-sm">...</span>}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllVolunteers;
