
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';

export class ProfileService {
  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Loading profile for user:', userId);
      
      // Get user profile using RPC or direct query with proper typing
      const { data: profile, error: profileError } = await supabase
        .rpc('get_user_profile', { user_id: userId });

      if (profileError) {
        console.error('Error loading profile via RPC, trying direct query:', profileError);
        
        // Fallback to direct query
        try {
          const { data: user } = await supabase.auth.getUser();
          if (user.user && user.user.id === userId) {
            const userRole = user.user.user_metadata?.role || 'customer';
            console.log('Creating profile from user metadata:', userRole);
            
            return {
              id: userId,
              email: user.user.email || '',
              full_name: user.user.user_metadata?.full_name || user.user.email || '',
              role: userRole
            };
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
        
        return null;
      }

      if (profile) {
        const userProfileData = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role
        };
        console.log('User profile loaded:', userProfileData);
        return userProfileData;
      }

      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Method to fix existing admin accounts
  static async fixAdminAccount(email: string) {
    try {
      console.log('Attempting to fix admin account for:', email);
      
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user && user.user.email === email) {
        // Try to create profile via RPC
        const { error: profileError } = await supabase
          .rpc('create_user_profile', {
            user_id: user.user.id,
            user_email: user.user.email,
            user_full_name: user.user.user_metadata?.full_name || user.user.email,
            user_role: 'admin'
          });

        if (profileError) {
          console.error('Error creating/updating profile via RPC:', profileError);
        }

        return { success: !profileError };
      }
      
      return { success: false, message: 'User not found or not logged in' };
    } catch (error) {
      console.error('Error fixing admin account:', error);
      return { success: false, message: 'Error fixing account' };
    }
  }
}
