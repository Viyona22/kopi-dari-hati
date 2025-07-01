
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';

export class ProfileService {
  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Loading profile for user:', userId);
      
      // Since we can't directly query the profiles table due to type constraints,
      // we'll get the user data from auth and construct the profile
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user && user.user.id === userId) {
        // Get role from user metadata, default to customer
        const userRole = user.user.user_metadata?.role || 'customer';
        
        const userProfile = {
          id: userId,
          email: user.user.email || '',
          full_name: user.user.user_metadata?.full_name || user.user.email || '',
          role: userRole as 'admin' | 'customer'
        };
        
        console.log('User profile loaded from auth metadata:', userProfile);
        return userProfile;
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
        // Since we can't directly access the profiles/user_roles tables,
        // we'll update the user metadata instead
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: user.user.user_metadata?.full_name || user.user.email,
            role: 'admin'
          }
        });

        if (error) {
          console.error('Error updating user metadata:', error);
        }

        return { success: !error };
      }
      
      return { success: false, message: 'User not found or not logged in' };
    } catch (error) {
      console.error('Error fixing admin account:', error);
      return { success: false, message: 'Error fixing account' };
    }
  }
}
