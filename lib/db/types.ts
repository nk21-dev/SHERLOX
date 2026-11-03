export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  google_id: string | null;
  avatar_url: string | null;
  created_at: number;
  updated_at: number;
}

export interface Session {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: number;
  created_at: number;
  ip_address: string | null;
  user_agent: string | null;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: number;
  used_at: number | null;
  created_at: number;
}

