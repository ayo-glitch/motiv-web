import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { googleAuth } from '@/lib/api/auth';

interface SimpleGoogleAuthButtonProps {
  onSuccess: (response: any) => void;
  onError: (message: string) => void;
}

const SimpleGoogleAuthButton: React.FC<SimpleGoogleAuthButtonProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      
      // 1. Sign in with Firebase
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      // 2. Send ID token to your backend
      const response = await googleAuth(idToken);
      
      // 3. Handle success
      onSuccess(response);
      
    } catch (error) {
      console.error('Google auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to authenticate with Google';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
};

export default SimpleGoogleAuthButton;
