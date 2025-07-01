
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';

export class ProfileService {
  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Loading profile for user:', userId);
      
      // Try to load profile from profiles table with join to user_roles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          user_roles!inner(role)
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading profile from database:', profileError);
        
        // Fallback to user metadata if profile doesn't exist yet
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

      if (profileData && profileData.user_roles && profileData.user_roles.length > 0) {
        const userProfileData = {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name || '',
          role: profileData.user_roles[0].role
        };
        console.log('User profile loaded from database:', userProfileData);
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
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.user.id,
            email: user.user.email,
            full_name: user.user.user_metadata?.full_name || user.user.email
          });

        if (profileError) {
          console.error('Error creating/updating profile:', profileError);
        }

        // Create role entry
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: user.user.id,
            role: 'admin'
          });

        if (roleError) {
          console.error('Error creating/updating role:', roleError);
        }

        return { success: !profileError && !roleError };
      }
      
      return { success: false, message: 'User not found or not logged in' };
    } catch (error) {
      console.error('Error fixing admin account:', error);
      return { success: false, message: 'Error fixing account' };
    }
  }
}
