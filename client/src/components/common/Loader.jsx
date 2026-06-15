const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-14 h-14 border-2',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-white/10 border-t-emerald-400 rounded-full animate-spin-slow`}
        />
        <div
          className={`absolute inset-1 ${sizeClasses[size].replace('border-2', 'border').replace('w-6 h-6', 'w-4 h-4').replace('w-10 h-10', 'w-8 h-8').replace('w-14 h-14', 'w-12 h-12')} border-white/5 border-t-violet-400 rounded-full animate-spin-slow`}
          style={{ animationDirection: 'reverse', animationDuration: '0.7s' }}
        />
      </div>
      {text && (
        <p className="text-slate-400 text-sm font-mono tracking-widest">{text}</p>
      )}
    </div>
  );
};

export default Loader;
