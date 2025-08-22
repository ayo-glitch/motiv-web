import { apiClient } from '../client';
import { 
  LoginRequest, 
  SignupRequest, 
  AuthResponse, 
  User 
} from '@/lib/types/api';
import { googleAuthService, GoogleAuthResponse } from '@/lib/services/googleAuth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Set token in client for future requests
    if (response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
    
    // Set token in client for future requests
    if (response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  },

  async getMe(): Promise<User> {
    return apiClient.get<User>('/users/me');
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    return apiClient.put<User>('/users/me', userData);
  },

  async googleAuth(): Promise<AuthResponse> {
    // Get Google credential using Firebase
    const googleResponse = await googleAuthService.signInWithGoogle();
    
    // Send Firebase ID token to backend for verification and user creation/login
    const response = await apiClient.post<AuthResponse>('/auth/google', {
      idToken: googleResponse.credential,
    });
    
    // Set token in client for future requests
    if (response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  },

  logout() {
    apiClient.clearToken();
    googleAuthService.signOut();
    // Clear any other client-side auth state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('motiv_user');
    }
  }
};