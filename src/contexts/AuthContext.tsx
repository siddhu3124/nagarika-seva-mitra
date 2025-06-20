
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
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
      } else {
        // Type cast the role to ensure it matches our interface
        const userProfile: User = {
          ...data,
          role: data.role as 'citizen' | 'official'
        };
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      if (!session?.user) {
        throw new Error('No authenticated session found');
      }

      // Insert or update user profile in database
      const { error } = await supabase
        .from('users')
        .upsert({
          auth_user_id: session.user.id,
          ...userData
        });

      if (error) {
        throw error;
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
      isAuthenticated: !!session && !!user,
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
