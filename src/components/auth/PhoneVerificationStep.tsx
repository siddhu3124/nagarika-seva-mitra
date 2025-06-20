
import React, { useState, useCallback, useMemo } from 'react';
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

  // Memoize validation logic for better performance
  const isValidPhoneNumber = useMemo(() => {
    return currentPhoneNumber && currentPhoneNumber.length >= 10;
  }, [currentPhoneNumber]);

  // Optimize phone number formatting
  const formatPhoneNumber = useCallback((phone: string) => {
    return phone.startsWith('+91') ? phone : `+91${phone}`;
  }, []);

  // Optimized OTP send handler with debouncing
  const handleSendOTP = useCallback(async () => {
    if (!isValidPhoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    const formattedPhone = formatPhoneNumber(currentPhoneNumber);
    const success = await sendOTP(formattedPhone);
    if (success) {
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formattedPhone}`,
      });
    }
  }, [currentPhoneNumber, isValidPhoneNumber, formatPhoneNumber, sendOTP, toast]);

  // Optimized OTP verification handler
  const handleVerifyOTP = useCallback(async (otp: string) => {
    const success = await verifyOTP(otp);
    if (success) {
      toast({
        title: "Success", 
        description: "Phone verified successfully",
      });
      onVerificationComplete();
    }
    return success;
  }, [verifyOTP, toast, onVerificationComplete]);

  // Optimized resend handler
  const handleResendOTP = useCallback(() => {
    resetOTP();
    setStep('phone');
    toast({
      title: "Resetting",
      description: "Please enter your phone number again",
    });
  }, [resetOTP, toast]);

  // Phone input handler with optimization
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setCurrentPhoneNumber(value);
  }, []);

  if (step === 'phone') {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">{t('phone_number')} *</Label>
          <Input
            id="phone"
            type="tel"
            value={currentPhoneNumber}
            onChange={handlePhoneChange}
            placeholder={t('enter_phone_placeholder')}
            maxLength={10}
            autoComplete="tel"
          />
        </div>
        <Button 
          onClick={handleSendOTP}
          disabled={phoneLoading || !isValidPhoneNumber}
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
