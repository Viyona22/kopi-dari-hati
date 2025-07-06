
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';

export class ProfileService {
  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Loading profile for user:', userId);
      
      // Add timeout wrapper to all database calls
      const executeWithTimeout = async <T>(promise: Promise<T>, timeoutMs: number = 2000): Promise<T> => {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Database timeout')), timeoutMs)
        );
        return Promise.race([promise, timeoutPromise]);
      };
      
      // First, get the profile data with timeout
      const { data: profileData, error: profileError } = await executeWithTimeout(
        supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('id', userId)
          .maybeSingle()
      );

      if (profileError) {
        console.error('Error loading profile:', profileError);
        return null;
      }

      if (!profileData) {
        console.log('No profile found for user:', userId);
        return null;
      }

      // Then, get the user role with timeout
      const { data: roleData, error: roleError } = await executeWithTimeout(
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle()
      );

      if (roleError) {
        console.error('Error loading user role:', roleError);
        return null;
      }

      if (!roleData) {
        console.log('No role found for user:', userId);
        return null;
      }

      const userProfile: UserProfile = {
        id: profileData.id,
        email: profileData.email || '',
        full_name: profileData.full_name || profileData.email || '',
        role: roleData.role as 'admin' | 'customer'
      };
      
      console.log('User profile loaded from database:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Method to update user profile
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      console.log('Updating user profile for:', userId, updates);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error };
    }
  }

  // Method to get user role
  static async getUserRole(userId: string): Promise<'admin' | 'customer' | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        console.error('Error getting user role:', error);
        return null;
      }

      return data.role as 'admin' | 'customer';
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
}
