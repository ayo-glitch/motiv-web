import { apiClient } from './client';

export interface GoogleAuthRequest {
  idToken: string;
}

export interface GoogleAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    username?: string;
  };
  isNewUser?: boolean;
}

export const googleAuth = async (idToken: string): Promise<GoogleAuthResponse> => {
  const response = await apiClient.post<GoogleAuthResponse>('/auth/google', {
    idToken
  });
  return response;
};
