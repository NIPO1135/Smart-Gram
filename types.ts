
export type Language = 'en' | 'bn';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'user' | 'admin' | 'volunteer';
  profilePicture?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface Category {
  id: string;
  title: { en: string; bn: string };
  icon: string;
  color: string;
}
