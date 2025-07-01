
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';

export class ProfileService {
  static async loadUserProfile(userId: string): Promise<UserProfile | null> {
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
              return null;
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
          return null;
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
            return {
              id: profileData.id,
              email: profileData.email,
              full_name: profileData.full_name,
              role: 'customer'
            };
          }
        }
        return null;
      }

      if (profileData && roleData) {
        const userProfileData = {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          role: roleData.role
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
}
