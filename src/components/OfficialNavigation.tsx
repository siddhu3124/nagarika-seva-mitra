
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';

const OfficialNavigation = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/official/dashboard', label: 'Analytics Dashboard', icon: '📊' },
    { path: '/official/send-messages', label: 'Send Messages', icon: '📢' },
    { path: '/official/district-summary', label: 'District Summary', icon: '📋' }
  ];

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-government-blue">నాగరిక మిత్ర - Official</h1>
            <span className="text-sm text-gray-600">
              Welcome, {user?.name} ({user?.department})
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <Button onClick={handleLogout} variant="outline" size="sm">
              {t('logout')}
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-3 overflow-x-auto">
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              variant={location.pathname === item.path ? "default" : "outline"}
              className="whitespace-nowrap"
              size="sm"
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficialNavigation;
