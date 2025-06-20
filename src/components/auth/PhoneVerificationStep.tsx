
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';
import OTPInput from '@/components/OTPInput';

interface PhoneVerificationStepProps {
  onVerificationComplete: () => void;
}

const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({ onVerificationComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { loading: phoneLoading, phoneNumber, sendOTP, verifyOTP, resetOTP } = usePhoneAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');

  const handleSendOTP = async () => {
    if (!currentPhoneNumber || currentPhoneNumber.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    const formattedPhone = currentPhoneNumber.startsWith('+91') 
      ? currentPhoneNumber 
      : `+91${currentPhoneNumber}`;

    const success = await sendOTP(formattedPhone);
    if (success) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    const success = await verifyOTP(otp);
    if (success) {
      onVerificationComplete();
    }
    return success;
  };

  const handleResendOTP = () => {
    resetOTP();
    setStep('phone');
  };

  if (step === 'phone') {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">{t('phone_number')} *</Label>
          <Input
            id="phone"
            type="tel"
            value={currentPhoneNumber}
            onChange={(e) => setCurrentPhoneNumber(e.target.value)}
            placeholder={t('enter_phone_placeholder')}
          />
        </div>
        <Button 
          onClick={handleSendOTP}
          disabled={phoneLoading}
          className="w-full bg-government-blue hover:bg-government-blue/90"
        >
          {phoneLoading ? 'Sending...' : 'Send OTP'}
        </Button>
      </div>
    );
  }

  return (
    <OTPInput
      onVerify={handleVerifyOTP}
      onResend={handleResendOTP}
      loading={phoneLoading}
      phoneNumber={phoneNumber}
    />
  );
};

export default PhoneVerificationStep;
