
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      let profileData = profile;

      if (profileError) {
        console.error('Error loading profile:', profileError);
        
        // If profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          const { data: user } = await supabase.auth.getUser();
          if (user.user) {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: user.user.email,
                full_name: user.user.user_metadata?.full_name || user.user.email
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
              setUserProfile(null);
              return;
            }

            // Assign default customer role
            await supabase
              .from('user_roles')
              .insert({
                user_id: userId,
                role: 'customer'
              });

            profileData = newProfile;
          }
        } else {
          setUserProfile(null);
          return;
        }
      }

      // Get user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.error('Error loading role:', roleError);
        
        // If no role exists, assign customer role
        if (roleError.code === 'PGRST116') {
          console.log('Role not found, assigning customer role...');
          await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: 'customer'
            });
          
          // Set default role
          if (profileData) {
            setUserProfile({
              id: profileData.id,
              email: profileData.email,
              full_name: profileData.full_name,
              role: 'customer'
            });
          }
        } else {
          setUserProfile(null);
        }
        return;
      }

      if (profileData && roleData) {
        const userProfileData = {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          role: roleData.role
        };
        console.log('User profile loaded:', userProfileData);
        setUserProfile(userProfileData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    console.log('Sign in result:', { data, error });
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Signing up user:', email, fullName);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    console.log('Sign up result:', { data, error });
    return { data, error };
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUserProfile(null);
    }
    return { error };
  };

  return {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: userProfile?.role === 'admin',
    isCustomer: userProfile?.role === 'customer'
  };
}
