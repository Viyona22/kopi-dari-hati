
import { supabase } from '@/lib/supabase';

export class AuthService {
  static async signIn(email: string, password: string) {
    console.log('Signing in user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    console.log('Sign in result:', { data, error });
    return { data, error };
  }

  static async signUp(email: string, password: string, fullName: string, role: 'admin' | 'customer' = 'customer') {
    console.log('Signing up user:', email, fullName, 'as role:', role);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      console.log('Sign up result:', { data, error });
      
      // If signup was successful, the trigger should have created the profile
      if (data?.user && !error) {
        // Verify profile was created
        const { data: profile } = await supabase
          .rpc('get_user_profile', { user_id: data.user.id });
        
        console.log('Profile created by trigger:', profile);
        
        return { 
          data, 
          error: null,
          profileCreated: !!profile
        };
      }
      
      return { data, error };
    } catch (signupError) {
      console.error('Signup exception:', signupError);
      return { 
        data: null, 
        error: signupError 
      };
    }
  }

  static async signOut() {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async resetPassword(email: string) {
    console.log('Requesting password reset for:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
    return { error };
  }

  static async resendConfirmation(email: string) {
    console.log('Resending confirmation email for:', email);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    return { error };
  }

  // Method to check if user exists in auth
  static async checkUserExists(email: string) {
    try {
      // Try to trigger password reset to see if user exists
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return !error; // If no error, user exists
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }
}
