
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';
import { AuthService } from '@/services/authService';
import { ProfileService } from '@/services/profileService';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Memoize profile loading to prevent unnecessary calls
  const loadUserProfile = useCallback(async (userId: string) => {
    if (profileLoading) {
      console.log('Profile loading already in progress, skipping...');
      return;
    }

    console.log('Loading user profile for:', userId);
    setProfileLoading(true);
    
    try {
      const profile = await ProfileService.loadUserProfile(userId);
      console.log('Profile loaded:', profile);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  }, [profileLoading]);

  // Debounce auth state changes to prevent multiple rapid calls
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('Auth state changed:', event, session?.user?.id);
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user && !profileLoading) {
      // Use setTimeout to avoid blocking the auth state change and prevent rapid successive calls
      setTimeout(() => {
        loadUserProfile(session.user.id);
      }, 100);
    } else if (!session?.user) {
      setUserProfile(null);
    }
    
    setLoading(false);
  }, [loadUserProfile, profileLoading]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener with debounced handler
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session only once
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to run only once

  const signIn = async (email: string, password: string) => {
    return await AuthService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'customer' = 'customer') => {
    return await AuthService.signUp(email, password, fullName, role);
  };

  const signOut = async () => {
    const { error } = await AuthService.signOut();
    if (!error) {
      setUserProfile(null);
    }
    return { error };
  };

  // Memoize computed values to prevent unnecessary re-renders
  const authValue = useMemo(() => ({
    user,
    session,
    userProfile,
    loading: loading || profileLoading,
    signIn,
    signUp,
    signOut,
    isAdmin: userProfile?.role === 'admin',
    isCustomer: userProfile?.role === 'customer'
  }), [user, session, userProfile, loading, profileLoading]);

  return authValue;
}
