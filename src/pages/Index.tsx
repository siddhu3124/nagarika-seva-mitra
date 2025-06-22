
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, error } = useAuth();
  const { t } = useLanguage();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set a timeout to show error message if loading takes too long
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 15000); // 15 seconds

    if (!loading) {
      clearTimeout(timeout);
      
      if (error) {
        // Stay on this page to show error
        return;
      }
      
      if (isAuthenticated && user) {
        // Redirect based on user role
        if (user.role === 'citizen') {
          navigate('/citizen/feedback');
        } else if (user.role === 'official') {
          navigate('/official/dashboard');
        }
      } else {
        navigate('/login');
      }
    }

    return () => clearTimeout(timeout);
  }, [isAuthenticated, user, navigate, loading, error]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (error || timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-blue-bg to-government-blue">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6">
            {error || "The page is taking too long to load. This might be due to a slow network connection or server issues."}
          </p>
          <button 
            onClick={handleRefresh}
            className="bg-white text-government-blue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-blue-bg to-government-blue">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>{t('loading')} Nagarika Mitra...</p>
        <p className="text-sm text-white/80 mt-2">Please wait while we set things up</p>
      </div>
    </div>
  );
};

export default Index;
