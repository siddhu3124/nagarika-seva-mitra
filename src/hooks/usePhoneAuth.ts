
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePhoneAuth = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { toast } = useToast();

  const sendOTP = async (phone: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      setPhoneNumber(phone);
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
      return true;
    } catch (error) {
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
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP",
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
  };

  return {
    loading,
    otpSent,
    phoneNumber,
    sendOTP,
    verifyOTP,
    resetOTP
  };
};
