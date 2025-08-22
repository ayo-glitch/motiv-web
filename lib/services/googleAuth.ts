import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleAuthResponse {
  credential: string;
  user: GoogleUser;
}

class GoogleAuthService {
  private provider: GoogleAuthProvider;

  constructor() {
    this.provider = new GoogleAuthProvider();
    // Set custom parameters for account selection
    this.provider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  async signInWithGoogle(): Promise<GoogleAuthResponse> {
    try {
      const result = await signInWithPopup(auth, this.provider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Format user data to match expected interface
      const userData: GoogleUser = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        picture: user.photoURL || undefined,
        given_name: user.displayName?.split(' ')[0] || '',
        family_name: user.displayName?.split(' ').slice(1).join(' ') || '',
      };

      return {
        credential: idToken,
        user: userData,
      };
    } catch (error) {
      console.error('Firebase Google sign-in error:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase sign-out error:', error);
      throw new Error('Failed to sign out');
    }
  }
}

// Export singleton instance
export const googleAuthService = new GoogleAuthService();