import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';
import { 
  LoginRequest, 
  SignupRequest, 
  AuthResponse, 
  User 
} from '@/lib/types/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  // Check for token on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('motiv_user');
      setHasToken(!!savedUser);
    }
  }, []);

  // Get current user profile
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    enabled: typeof window !== 'undefined' && hasToken, // Only run if user token exists
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on mount if data exists
  });

  // Login mutation with custom redirect
  const loginMutation = useMutation({
    mutationFn: ({ credentials, redirectTo }: { credentials: LoginRequest; redirectTo?: string }) => 
      authService.login(credentials),
    onSuccess: (data: AuthResponse, { redirectTo }) => {
      // Update query cache with user data
      queryClient.setQueryData(['auth', 'me'], data.user);
      
      // Store user data in localStorage (for persistence)
      localStorage.setItem('motiv_user', JSON.stringify({
        ...data.user,
        token: data.token
      }));

      // Update hasToken state
      setHasToken(true);
      
      // Invalidate and refetch user query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      
      toast.success('Welcome back!');
      router.push(redirectTo || '/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    }
  });

  // Signup mutation with custom redirect
  const signupMutation = useMutation({
    mutationFn: ({ userData, redirectTo }: { userData: SignupRequest; redirectTo?: string }) => 
      authService.signup(userData),
    onSuccess: (data: AuthResponse, { redirectTo }) => {
      // Update query cache with user data
      queryClient.setQueryData(['auth', 'me'], data.user);
      
      // Store user data in localStorage
      localStorage.setItem('motiv_user', JSON.stringify({
        ...data.user,
        token: data.token
      }));

      // Update hasToken state
      setHasToken(true);
      
      // Invalidate and refetch user query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      
      toast.success('Account created successfully! Welcome to MOTIV!');
      router.push(redirectTo || '/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Signup failed');
    }
  });

  // Google auth mutation
  const googleAuthMutation = useMutation({
    mutationFn: ({ redirectTo }: { redirectTo?: string }) => authService.googleAuth(),
    onSuccess: (data: AuthResponse, { redirectTo }) => {
      // Update query cache with user data
      queryClient.setQueryData(['auth', 'me'], data.user);
      
      // Store user data in localStorage
      localStorage.setItem('motiv_user', JSON.stringify({
        ...data.user,
        token: data.token
      }));

      // Update hasToken state
      setHasToken(true);
      
      // Invalidate and refetch user query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      
      toast.success(`Welcome${data.user.name ? ` ${data.user.name}` : ''}!`);
      router.push(redirectTo || '/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Google authentication failed');
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<User>) => authService.updateProfile(userData),
    onSuccess: (updatedUser: User) => {
      // Update query cache
      queryClient.setQueryData(['auth', 'me'], updatedUser);
      
      // Update localStorage
      const savedData = localStorage.getItem('motiv_user');
      if (savedData) {
        const userData = JSON.parse(savedData);
        localStorage.setItem('motiv_user', JSON.stringify({
          ...userData,
          ...updatedUser
        }));
      }
      
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  // Logout function
  const logout = () => {
    authService.logout();
    setHasToken(false); // Update hasToken state
    queryClient.clear(); // Clear all cached data
    router.push('/');
    toast.success('Logged out successfully');
  };

  return {
    // Data
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    
    // Actions
    login: (credentials: LoginRequest, redirectTo?: string) => 
      loginMutation.mutate({ credentials, redirectTo }),
    signup: (userData: SignupRequest, redirectTo?: string) => 
      signupMutation.mutate({ userData, redirectTo }),
    googleAuth: (redirectTo?: string) => 
      googleAuthMutation.mutate({ redirectTo }),
    updateProfile: updateProfileMutation.mutate,
    logout,
    refetchUser,
    
    // Loading states
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isGoogleAuthenticating: googleAuthMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
};