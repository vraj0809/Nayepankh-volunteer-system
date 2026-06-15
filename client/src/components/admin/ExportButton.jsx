import { Download } from 'lucide-react';

const ExportButton = ({ onClick, loading, icon: Icon = Download, children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'gradient-primary text-white hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    success: 'bg-success text-white hover:bg-emerald-600',
    secondary: 'bg-secondary text-white hover:bg-orange-600',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin-slow" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
};

export default ExportButton;
