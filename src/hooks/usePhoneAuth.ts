
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePhoneAuth = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [canResend, setCanResend] = useState(true);
  const { toast } = useToast();

  const sendOTP = async (phone: string) => {
    setLoading(true);
    try {
      console.log('Attempting to send OTP to:', phone);
      
      // Validate phone number format before sending
      const phoneRegex = /^\+91[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid Indian mobile number (+91XXXXXXXXXX)",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) {
        console.error('OTP send error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      setPhoneNumber(phone);
      setOtpSent(true);
      
      // Start 30s cooldown for resend
      setCanResend(false);
      setTimeout(() => {
        setCanResend(true);
      }, 30000);

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
      return true;
    } catch (error) {
      console.error('Send OTP error:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    setLoading(true);
    try {
      console.log('Attempting to verify OTP:', otp, 'for phone:', phoneNumber);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('OTP verify error:', error);
        toast({
          title: "Invalid OTP",
          description: "Invalid OTP. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        console.log('OTP verified successfully, user:', data.user);
        toast({
          title: "Success",
          description: "Phone number verified successfully",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetOTP = () => {
    setOtpSent(false);
    setPhoneNumber('');
    setCanResend(true);
  };

  return {
    loading,
    otpSent,
    phoneNumber,
    canResend,
    sendOTP,
    verifyOTP,
    resetOTP
  };
};
