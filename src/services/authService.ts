
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
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      console.log('Sign up result:', { data, error });
      
      // Check if signup was successful but user needs email confirmation
      if (data?.user && !data.user.email_confirmed_at) {
        console.log('User created but needs email confirmation');
        return { 
          data, 
          error: null,
          needsConfirmation: true
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
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
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
