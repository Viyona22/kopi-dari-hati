
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';

export class ProfileService {
  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Loading profile for user:', userId);
      
      // Add timeout wrapper to all database calls
      const executeWithTimeout = async <T>(promise: Promise<T>, timeoutMs: number = 1500): Promise<T> => {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Database timeout')), timeoutMs)
        );
        return Promise.race([promise, timeoutPromise]);
      };
      
      // First, get the profile data with timeout
      const profileResult = await executeWithTimeout(
        supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('id', userId)
          .maybeSingle(),
        1500
      );

      if (profileResult.error) {
        console.error('Error loading profile:', profileResult.error);
        return null;
      }

      if (!profileResult.data) {
        console.log('No profile found for user:', userId);
        return null;
      }

      // Then, get the user role with timeout
      const roleResult = await executeWithTimeout(
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle(),
        1500
      );

      if (roleResult.error) {
        console.error('Error loading user role:', roleResult.error);
        return null;
      }

      if (!roleResult.data) {
        console.log('No role found for user:', userId);
        return null;
      }

      const userProfile: UserProfile = {
        id: profileResult.data.id,
        email: profileResult.data.email || '',
        full_name: profileResult.data.full_name || profileResult.data.email || '',
        role: roleResult.data.role as 'admin' | 'customer'
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
