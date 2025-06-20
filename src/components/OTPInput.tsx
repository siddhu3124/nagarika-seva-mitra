
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useLanguage } from '@/contexts/LanguageContext';

interface OTPInputProps {
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => void;
  loading: boolean;
  phoneNumber: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ onVerify, onResend, loading, phoneNumber }) => {
  const [otp, setOtp] = useState('');
  const { t } = useLanguage();

  // Memoize validation for better performance
  const isValidOTP = useMemo(() => otp.length === 6, [otp]);

  // Optimize OTP verification with useCallback
  const handleVerify = useCallback(async () => {
    if (isValidOTP) {
      await onVerify(otp);
    }
  }, [otp, isValidOTP, onVerify]);

  // Optimize OTP change handler
  const handleOTPChange = useCallback((value: string) => {
    setOtp(value);
  }, []);

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
      </div>

      <div className="space-y-2">
        <Button 
          onClick={handleVerify}
          disabled={loading || !isValidOTP}
          className="w-full bg-government-blue hover:bg-government-blue/90"
        >
          {loading ? 'Verifying...' : t('verify_otp')}
        </Button>
        
        <Button 
          variant="outline"
          onClick={onResend}
          disabled={loading}
          className="w-full"
        >
          {t('resend_otp')}
        </Button>
      </div>
    </div>
  );
};

export default OTPInput;
