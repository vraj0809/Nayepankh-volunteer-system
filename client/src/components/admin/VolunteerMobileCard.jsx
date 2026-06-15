import { Link } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import StatusBadge from '../volunteer/StatusBadge';
import { formatShortDate, truncateText } from '../../utils/formatters';

const VolunteerMobileCard = ({
  volunteer,
  index,
  page,
  selected,
  onToggleSelect,
  onApprove,
  onReject,
  onDelete,
  actionLoading,
}) => (
  <div className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-surface-alt/50 transition-colors">
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        className="w-4 h-4 rounded border-gray-300 mt-1 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{volunteer.fullName}</p>
            <p className="text-xs text-text-secondary truncate">{volunteer.email}</p>
          </div>
          <StatusBadge status={volunteer.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <span className="text-text-secondary">Phone</span>
            <p className="font-medium text-text-primary">{volunteer.phone}</p>
          </div>
          <div>
            <span className="text-text-secondary">City</span>
            <p className="font-medium text-text-primary">{volunteer.city}</p>
          </div>
          <div className="col-span-2">
            <span className="text-text-secondary">College</span>
            <p className="font-medium text-text-primary truncate">{volunteer.college}</p>
          </div>
        </div>

        {(volunteer.skills || []).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {(volunteer.skills || []).slice(0, 3).map((s) => (
              <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium">
                {s}
              </span>
            ))}
            {(volunteer.skills || []).length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-text-secondary rounded text-[10px] font-medium">
                +{volunteer.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            #{(page - 1) * 10 + index + 1} · {formatShortDate(volunteer.registeredAt)}
          </span>
          <div className="flex items-center gap-1">
            <Link
              to={`/admin/volunteers/${volunteer._id}`}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            {volunteer.status !== 'approved' && (
              <button
                onClick={() => onApprove(volunteer._id)}
                disabled={actionLoading === volunteer._id}
                className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {volunteer.status !== 'rejected' && (
              <button
                onClick={() => onReject(volunteer._id)}
                disabled={actionLoading === volunteer._id}
                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(volunteer._id)}
              disabled={actionLoading === volunteer._id}
              className="p-2 text-gray-400 hover:bg-red-50 hover:text-error rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default VolunteerMobileCard;
