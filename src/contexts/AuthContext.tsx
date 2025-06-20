
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  phone_number: string;
  locality?: string;
  department?: string;
  employee_id?: string;
  role: 'citizen' | 'official';
  district?: string;
  mandal?: string;
  village?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      
      if (session && session.user) {
        // Check if we have stored employee info (for officials)
        const storedEmployeeInfo = localStorage.getItem('employeeInfo');
        if (storedEmployeeInfo) {
          const employeeData = JSON.parse(storedEmployeeInfo);
          const userData: User = {
            id: 'official_' + employeeData.id,
            name: employeeData.name,
            department: employeeData.department,
            employee_id: employeeData.employee_id,
            phone_number: employeeData.phone_number || session.user.phone || '',
            district: employeeData.district,
            mandal: employeeData.mandal,
            village: employeeData.village,
            role: 'official'
          };
          setUser(userData);
        } else {
          // Try to fetch user profile from database
          await fetchUserProfile(session.user.id);
        }
      } else {
        setUser(null);
        localStorage.removeItem('employeeInfo');
      }
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      if (session) {
        // The onAuthStateChange will handle setting the user
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } else if (data) {
        const userProfile: User = {
          ...data,
          role: data.role as 'citizen' | 'official'
        };
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
    }
  };

  const login = async (userData: User) => {
    try {
      console.log('Login attempt for user:', userData);
      
      // For officials, we don't need to store in database, just set the user
      if (userData.role === 'official') {
        setUser(userData);
        return;
      }

      // For citizens, store in database if we have a session
      if (session?.user) {
        const { error } = await supabase
          .from('users')
          .upsert({
            auth_user_id: session.user.id,
            ...userData
          });

        if (error) {
          throw error;
        }
      }

      setUser(userData);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      localStorage.removeItem('employeeInfo');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      logout,
      isAuthenticated: !!user, // Changed to check user instead of session for officials
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
