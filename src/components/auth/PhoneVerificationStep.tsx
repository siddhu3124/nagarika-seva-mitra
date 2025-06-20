
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
  const { loading: phoneLoading, phoneNumber, canResend, sendOTP, verifyOTP, resetOTP } = usePhoneAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('+91');

  // Memoize validation logic for better performance with strict Indian mobile format
  const isValidPhoneNumber = useMemo(() => {
    // Check if phone number has valid format: +91 followed by 10 digits starting with 6-9
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    return phoneRegex.test(currentPhoneNumber);
  }, [currentPhoneNumber]);

  // Optimized phone input handler with proper formatting
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Always ensure it starts with +91
    if (!value.startsWith('+91')) {
      value = '+91';
    }
    
    // Remove any non-digit characters after +91
    const digitsOnly = value.slice(3).replace(/\D/g, '');
    
    // Limit to 10 digits after +91
    const limitedDigits = digitsOnly.slice(0, 10);
    
    // Combine +91 with the digits
    const formattedValue = '+91' + limitedDigits;
    
    setCurrentPhoneNumber(formattedValue);
  }, []);

  // Handle key press to prevent invalid characters and enforce format
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    const value = e.currentTarget.value;
    const selectionStart = e.currentTarget.selectionStart || 0;
    
    // Allow backspace, delete, tab, escape, enter, arrow keys
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
      return;
    }
    
    // If cursor is before position 3 (within +91), prevent input except for specific cases
    if (selectionStart < 3) {
      e.preventDefault();
      return;
    }
    
    // Only allow digits after +91
    if (!/^\d$/.test(char)) {
      e.preventDefault();
      return;
    }
    
    // Don't allow more than 10 digits after +91
    if (value.length >= 13) {
      e.preventDefault();
    }
  }, []);

  // Handle cursor positioning to prevent editing +91 prefix
  const handleClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (input.selectionStart !== null && input.selectionStart < 3) {
      setTimeout(() => {
        input.setSelectionRange(3, 3);
      }, 0);
    }
  }, []);

  // Optimized OTP send handler
  const handleSendOTP = useCallback(async () => {
    if (!isValidPhoneNumber) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9",
        variant: "destructive"
      });
      return;
    }

    const success = await sendOTP(currentPhoneNumber);
    if (success) {
      setStep('otp');
    }
  }, [currentPhoneNumber, isValidPhoneNumber, sendOTP, toast]);

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
            onKeyDown={handleKeyPress}
            onClick={handleClick}
            placeholder="+91XXXXXXXXXX"
            maxLength={13}
            autoComplete="tel"
            className="font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: +91 followed by 10 digits starting with 6, 7, 8, or 9
          </p>
          {currentPhoneNumber.length > 3 && !isValidPhoneNumber && (
            <p className="text-xs text-red-500 mt-1">
              Invalid format. Number must start with 6, 7, 8, or 9 after +91
            </p>
          )}
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
      canResend={canResend}
    />
  );
};

export default PhoneVerificationStep;
