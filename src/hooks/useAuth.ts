
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

  // Memoize profile loading to prevent unnecessary calls with timeout handling
  const loadUserProfile = useCallback(async (userId: string) => {
    // Prevent redundant calls if profile is already loaded or loading
    if (profileLoading || profileLoaded) {
      console.log('Profile loading already in progress or completed, skipping...');
      return;
    }

    console.log('Loading user profile for:', userId);
    setProfileLoading(true);
    
    try {
      // Add timeout to profile loading
      const profilePromise = ProfileService.loadUserProfile(userId);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile loading timeout')), 8000)
      );

      const profile = await Promise.race([profilePromise, timeoutPromise]) as UserProfile | null;
      
      console.log('Profile loaded:', profile);
      setUserProfile(profile);
      setProfileLoaded(true);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Don't fail completely, just log the error and continue
      // User can still use the app without profile data
      if (error instanceof Error && error.message === 'Profile loading timeout') {
        console.log('Profile loading timed out, continuing without profile data');
      }
      setUserProfile(null);
      setProfileLoaded(true); // Mark as loaded even if failed to prevent infinite retries
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
      
      // Load profile for authenticated user with a small delay
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

    // Check for existing session only once with timeout
    const checkSession = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (!mounted) return;
        
        console.log('Initial session check:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (!mounted) return;
        
        // Continue without session if check fails
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
