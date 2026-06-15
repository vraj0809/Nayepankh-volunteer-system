const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/25',
      dot: 'bg-amber-400',
      label: 'Pending',
    },
    approved: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/25',
      dot: 'bg-emerald-400',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/25',
      dot: 'bg-rose-400',
      label: 'Rejected',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border font-mono tracking-wide ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'pending' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
