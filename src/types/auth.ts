
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
}
