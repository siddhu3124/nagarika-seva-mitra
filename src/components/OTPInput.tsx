
import React, { useState } from 'react';
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

  const handleVerify = async () => {
    if (otp.length === 6) {
      await onVerify(otp);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          {t('otp_sent_to')} {phoneNumber}
        </p>
        
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
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
          disabled={loading || otp.length !== 6}
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
