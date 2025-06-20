
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageToggle from '@/components/LanguageToggle';
import PhoneVerificationStep from '@/components/auth/PhoneVerificationStep';
import ProfileCompletionStep from '@/components/auth/ProfileCompletionStep';

const LoginPage = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');

  const handleVerificationComplete = () => {
    setStep('profile');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'phone':
        return 'Phone Verification';
      case 'otp':
        return 'Enter OTP';
      case 'profile':
        return 'Complete Profile';
      default:
        return 'Phone Verification';
    }
  };

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
            {(step === 'phone' || step === 'otp') && (
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
