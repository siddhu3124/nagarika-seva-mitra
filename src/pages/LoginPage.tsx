
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageToggle from '@/components/LanguageToggle';
import PhoneVerificationStep from '@/components/auth/PhoneVerificationStep';
import ProfileCompletionStep from '@/components/auth/ProfileCompletionStep';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [step, setStep] = useState<'phone' | 'profile'>('phone');
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    console.log('LoginPage useEffect - Auth state:', { isAuthenticated, authLoading, user });
    
    if (!authLoading && isAuthenticated && user) {
      console.log('User authenticated, redirecting...', user);
      if (user.role === 'citizen') {
        navigate('/citizen');
      } else if (user.role === 'official') {
        navigate('/official');
      }
    }
  }, [isAuthenticated, authLoading, user, navigate]);

  const handleVerificationComplete = () => {
    console.log('Phone verification complete, moving to profile step');
    setStep('profile');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'phone':
        return 'Phone Verification';
      case 'profile':
        return 'Complete Profile';
      default:
        return 'Phone Verification';
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-blue-bg to-government-blue flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue-bg to-government-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">నాగరిక మిత్ర</h1>
          <h2 className="text-xl text-white/90">Nagarika Mitra</h2>
          <p className="text-white/80 mt-2">Government Citizen Service Platform</p>
        </div>

        <Card className="glass-effect animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center">
              <CardTitle className="text-government-blue">
                {getStepTitle()}
              </CardTitle>
              <LanguageToggle />
            </div>
          </CardHeader>
          <CardContent>
            {step === 'phone' && (
              <PhoneVerificationStep onVerificationComplete={handleVerificationComplete} />
            )}

            {step === 'profile' && (
              <ProfileCompletionStep />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
