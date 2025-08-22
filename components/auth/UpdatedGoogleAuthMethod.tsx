// Example of how to update your existing AuthModal handleGoogleAuth method
// Replace your existing handleGoogleAuth function with this simplified Firebase approach:

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { googleAuth } from '@/lib/api/auth';

const handleGoogleAuth = async () => {
  try {
    // Set loading state (use your existing state setter)
    // setGoogleLoading(true);
    
    // 1. Use Firebase for Google OAuth
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    
    // 2. Send ID token to your backend
    const response = await googleAuth(idToken);
    
    // 3. Handle the response
    const userData = {
      token: response.token,
      user: response.user,
      email: result.user.email
    };
    
    // 4. Update your app's auth state (use your existing signIn method)
    // await signIn(userData);
    
    // 5. Handle success (use your existing success handler)
    // onAuthSuccess(userData);
    // onClose();
    
  } catch (err) {
    console.error('Google auth error:', err);
    // Handle error (use your existing error setter)
    // setError('Failed to authenticate with Google');
  } finally {
    // Reset loading state (use your existing state setter)
    // setGoogleLoading(false);
  }
};
