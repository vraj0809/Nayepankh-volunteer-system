const StatCard = ({ icon: Icon, label, value, color = 'primary', suffix = '' }) => {
  const styleMap = {
    primary: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', bar: 'bg-emerald-500' },
    success: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', bar: 'bg-emerald-500' },
    warning: { icon: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', bar: 'bg-amber-500' },
    error: { icon: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', bar: 'bg-rose-500' },
    secondary: { icon: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', bar: 'bg-violet-500' },
  };

  const s = styleMap[color] || styleMap.primary;

  return (
    <div className="card-elevated p-4 sm:p-5 card-hover relative overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.bar} opacity-60`} />

      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${s.bg} border flex items-center justify-center`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.icon}`} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
        {value}{suffix}
      </p>
      <p className="text-xs text-slate-500 mt-1 tracking-wide">{label}</p>
    </div>
  );
};

export default StatCard;
