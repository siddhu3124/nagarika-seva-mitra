
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useLanguage } from '@/contexts/LanguageContext';

interface OTPInputProps {
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<boolean>;
  loading: boolean;
  phoneNumber: string;
  canResend: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ onVerify, onResend, loading, phoneNumber, canResend }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { t } = useLanguage();

  // Memoize validation for better performance
  const isValidOTP = useMemo(() => {
    return otp.length === 6 && /^\d{6}$/.test(otp);
  }, [otp]);

  // Optimize OTP verification with useCallback
  const handleVerify = useCallback(async () => {
    if (!isValidOTP || isVerifying) {
      return;
    }

    setIsVerifying(true);
    try {
      const success = await onVerify(otp);
      if (!success) {
        // Clear OTP on failure so user can try again
        setOtp('');
      }
    } finally {
      setIsVerifying(false);
    }
  }, [otp, isValidOTP, onVerify, isVerifying]);

  // Optimize OTP change handler
  const handleOTPChange = useCallback((value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(cleanValue);
  }, []);

  // Handle resend OTP
  const handleResend = useCallback(async () => {
    if (!canResend || loading) {
      return;
    }
    
    await onResend();
    setOtp(''); // Clear current OTP when resending
  }, [canResend, loading, onResend]);

  // Memoize masked phone number for display
  const maskedPhoneNumber = useMemo(() => {
    if (!phoneNumber) return '';
    const cleanNumber = phoneNumber.replace(/^\+91/, '');
    return `+91****${cleanNumber.slice(-4)}`;
  }, [phoneNumber]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          {t('otp_sent_to')} {maskedPhoneNumber}
        </p>
        
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={handleOTPChange}
            disabled={isVerifying}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        {otp.length > 0 && !isValidOTP && (
          <p className="text-xs text-red-500 mt-2">
            Please enter a valid 6-digit OTP
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Button 
          onClick={handleVerify}
          disabled={!isValidOTP || isVerifying}
          className="w-full bg-government-blue hover:bg-government-blue/90"
        >
          {isVerifying ? 'Verifying...' : t('verify_otp')}
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleResend}
          disabled={loading || !canResend || isVerifying}
          className="w-full"
        >
          {!canResend ? 'Resend in 30s' : t('resend_otp')}
        </Button>
      </div>
    </div>
  );
};

export default OTPInput;
