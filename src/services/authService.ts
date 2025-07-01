
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
    return { data, error };
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
}
