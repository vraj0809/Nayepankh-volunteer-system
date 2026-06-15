import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-alt p-4 sm:p-8">
      <div className="text-center max-w-lg animate-fade-in-up">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 sm:mb-8">
          <Search className="w-12 h-12 sm:w-16 sm:h-16 text-primary/50" />
        </div>
        <h1 className="text-6xl sm:text-8xl font-extrabold text-primary/20 mb-3 sm:mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 sm:mb-3">Page Not Found</h2>
        <p className="text-text-secondary text-sm sm:text-base mb-6 sm:mb-8 px-4">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
