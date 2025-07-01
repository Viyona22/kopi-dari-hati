
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
            const userRole = user.user.user_metadata?.role || 'customer';
            console.log('Creating profile with role from metadata:', userRole);
            
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

            // Create user role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: userId,
                role: userRole
              });

            if (roleError) {
              console.error('Error creating user role:', roleError);
            }

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
        
        // If no role exists, check user metadata first
        if (roleError.code === 'PGRST116') {
          console.log('Role not found, checking user metadata...');
          const { data: user } = await supabase.auth.getUser();
          const userRole = user.user?.user_metadata?.role || 'customer';
          
          console.log('Creating missing role:', userRole);
          const { error: createRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: userRole
            });
          
          if (createRoleError) {
            console.error('Error creating role:', createRoleError);
          }
          
          // Return profile with role from metadata
          if (profileData) {
            return {
              id: profileData.id,
              email: profileData.email,
              full_name: profileData.full_name,
              role: userRole
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

  // Method to fix existing admin accounts
  static async fixAdminAccount(email: string) {
    try {
      console.log('Attempting to fix admin account for:', email);
      
      // Try to find user by email in auth.users (this requires admin privileges)
      // For now, we'll provide a way to create missing profile and role
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user && user.user.email === email) {
        // Create profile if missing
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

        // Create or update role to admin
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: user.user.id,
            role: 'admin'
          });

        if (roleError) {
          console.error('Error creating/updating role:', roleError);
        }

        return { success: true };
      }
      
      return { success: false, message: 'User not found or not logged in' };
    } catch (error) {
      console.error('Error fixing admin account:', error);
      return { success: false, message: 'Error fixing account' };
    }
  }
}
