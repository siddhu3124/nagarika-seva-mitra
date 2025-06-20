
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

      // Use Supabase auth.signInWithOtp for Twilio integration
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          // Ensure we're using SMS channel
          channel: 'sms'
        }
      });

      if (error) {
        console.error('OTP send error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP",
          variant: "destructive"
        });
        return false;
      }

      console.log('OTP send response:', data);
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
    // Validate OTP format first
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      console.log('Attempting to verify OTP:', otp, 'for phone:', phoneNumber);
      
      // Use Supabase auth.verifyOtp with correct parameters for Twilio
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('OTP verify error:', error);
        toast({
          title: "Invalid OTP",
          description: error.message || "Invalid OTP. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      if (data.user && data.session) {
        console.log('OTP verified successfully, user:', data.user);
        console.log('Session created:', data.session);
        
        // Get the current session to ensure we have the latest data
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Current session after verification:', sessionData);
        
        toast({
          title: "Success",
          description: "Phone number verified successfully",
        });
        return true;
      }

      toast({
        title: "Verification Failed",
        description: "Unable to verify OTP. Please try again.",
        variant: "destructive"
      });
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

  const resendOTP = async () => {
    if (!canResend) {
      toast({
        title: "Please Wait",
        description: "You can resend OTP in a few seconds",
        variant: "destructive"
      });
      return false;
    }

    return await sendOTP(phoneNumber);
  };

  const resetOTP = () => {
    setOtpSent(false);
    setPhoneNumber('');
    setCanResend(true);
    setLoading(false);
  };

  return {
    loading,
    otpSent,
    phoneNumber,
    canResend,
    sendOTP,
    verifyOTP,
    resendOTP,
    resetOTP
  };
};
