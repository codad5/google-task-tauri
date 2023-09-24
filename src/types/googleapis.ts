export interface UserProfile {
  picture: string | null; // User's profile picture URL
  email: string | null; // User's email address
  name: string | null; // User's name
}

export interface AccessToken {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_in: number;
  id_token: string;
}

