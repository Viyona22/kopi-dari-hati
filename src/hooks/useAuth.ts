
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

  // Track if profile has been loaded to prevent redundant calls
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Memoize profile loading to prevent unnecessary calls
  const loadUserProfile = useCallback(async (userId: string) => {
    // Prevent redundant calls if profile is already loaded or loading
    if (profileLoading || profileLoaded) {
      console.log('Profile loading already in progress or completed, skipping...');
      return;
    }

    console.log('Loading user profile for:', userId);
    setProfileLoading(true);
    
    try {
      const profile = await ProfileService.loadUserProfile(userId);
      console.log('Profile loaded:', profile);
      setUserProfile(profile);
      setProfileLoaded(true);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  }, [profileLoading, profileLoaded]);

  // Handle auth state changes with debouncing
  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('Auth state changed:', event, session?.user?.id);
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user && !profileLoaded) {
      // Reset profile loaded state for new user
      if (userProfile?.id !== session.user.id) {
        setProfileLoaded(false);
        setUserProfile(null);
      }
      
      // Load profile for authenticated user
      setTimeout(() => {
        loadUserProfile(session.user.id);
      }, 100);
    } else if (!session?.user) {
      // Clear profile data on sign out
      setUserProfile(null);
      setProfileLoaded(false);
    }
    
    setLoading(false);
  }, [loadUserProfile, profileLoaded, userProfile?.id]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
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
    // Reset profile state on new sign in
    setProfileLoaded(false);
    return await AuthService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'customer' = 'customer') => {
    return await AuthService.signUp(email, password, fullName, role);
  };

  const signOut = async () => {
    const { error } = await AuthService.signOut();
    if (!error) {
      setUserProfile(null);
      setProfileLoaded(false);
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
