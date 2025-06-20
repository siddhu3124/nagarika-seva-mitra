
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
      console.log('Attempting to send OTP to:', phone);
      
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
      console.log('Attempting to verify OTP:', otp);
      
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('OTP verify error:', error);
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
      console.error('Verify OTP error:', error);
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
