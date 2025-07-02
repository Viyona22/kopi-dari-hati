
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';

export class ProfileService {
  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Loading profile for user:', userId);
      
      // Query profiles table with user_roles join
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          user_roles!inner(role)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return null;
      }

      if (data && data.user_roles && Array.isArray(data.user_roles) && data.user_roles.length > 0) {
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email || '',
          full_name: data.full_name || data.email || '',
          role: data.user_roles[0].role as 'admin' | 'customer'
        };
        
        console.log('User profile loaded from database:', userProfile);
        return userProfile;
      }

      return null;
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
