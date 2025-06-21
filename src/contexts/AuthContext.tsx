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
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listeners');
    
    // Set loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('⚠️ Auth loading timeout - setting loading to false');
      setLoading(false);
      setError('Authentication timeout. Please refresh the page.');
    }, 10000); // 10 second timeout

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.phone);
      clearTimeout(loadingTimeout); // Clear timeout since we got a response
      setSession(session);
      setError(null); // Clear any previous errors
      
      if (session && session.user) {
        console.log('Session found, checking for user profile');
        
        // Check if we have stored employee info (for officials)
        const storedEmployeeInfo = localStorage.getItem('employeeInfo');
        if (storedEmployeeInfo) {
          console.log('Found stored employee info');
          try {
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
            setLoading(false);
          } catch (err) {
            console.error('Error parsing employee data:', err);
            localStorage.removeItem('employeeInfo');
            setUser(null);
            setLoading(false);
          }
        } else {
          console.log('No stored employee info, fetching user profile from database');
          await fetchUserProfile(session.user.id);
        }
      } else {
        console.log('No session, clearing user state');
        setUser(null);
        localStorage.removeItem('employeeInfo');
        setLoading(false);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.phone);
      if (!session) {
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
      // The onAuthStateChange will handle setting the user if session exists
    }).catch((error) => {
      console.error('Error getting session:', error);
      clearTimeout(loadingTimeout);
      setLoading(false);
      setError('Failed to check authentication status');
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listeners');
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUserId: string) => {
    try {
      console.log('Fetching user profile for auth user ID:', authUserId);
      
      // Add timeout for database query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 8000);
      });

      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error fetching user profile:', error);
        if (error.code === 'PGRST116') {
          // No profile found - this is okay, user needs to complete profile
          console.log('No user profile found - user needs to complete profile');
          setUser(null);
        } else {
          // Other database errors
          console.error('Database error:', error);
          setError('Failed to load user profile. Please try again.');
          setUser(null);
        }
      } else if (data) {
        console.log('User profile found:', data);
        const userProfile: User = {
          ...data,
          role: data.role as 'citizen' | 'official'
        };
        setUser(userProfile);
      } else {
        console.log('No user profile found in database');
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error in fetchUserProfile:', error);
      if (error.message === 'Database query timeout') {
        setError('Database connection is slow. Please check your internet connection.');
      } else {
        setError('Failed to load user profile. Please try again.');
      }
      setUser(null);
    } finally {
      setLoading(false);
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
          console.error('Error saving user profile:', error);
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
      console.log('Logging out user');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setError(null);
      localStorage.removeItem('employeeInfo');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const contextValue = {
    user,
    session,
    login,
    logout,
    isAuthenticated: !!session,
    loading,
    error
  };

  console.log('AuthProvider context value:', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isAuthenticated: contextValue.isAuthenticated, 
    loading,
    error
  });

  return (
    <AuthContext.Provider value={contextValue}>
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
