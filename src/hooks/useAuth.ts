
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

  // Simplified profile loading without timeout complications
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
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, [profileLoading]);

  // Handle auth state changes
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('Auth state changed:', event, session?.user?.id);
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      // Load profile for authenticated user
      await loadUserProfile(session.user.id);
    } else {
      // Clear profile data on sign out
      setUserProfile(null);
    }
    
    setLoading(false);
  }, [loadUserProfile]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('Initial session check:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Session check failed:', error);
        if (!mounted) return;
        
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    checkSession();

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
