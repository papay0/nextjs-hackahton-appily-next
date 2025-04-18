/**
 * Utility functions for debugging Firebase authentication issues
 */

import { FirebaseError } from 'firebase/app';
import { Auth, User } from 'firebase/auth';

/**
 * Logs detailed information about the current Firebase authentication state
 */
export async function debugFirebaseAuth(auth: Auth): Promise<void> {
  const currentUser = auth.currentUser;
  
  console.log('------------------ Firebase Auth Debug ------------------');
  console.log('Firebase Auth initialized:', !!auth);
  console.log('Current user exists:', !!currentUser);
  
  if (currentUser) {
    console.log('Current user info:');
    console.log('- UID:', currentUser.uid);
    console.log('- Email:', currentUser.email);
    console.log('- Anonymous:', currentUser.isAnonymous);
    console.log('- Provider IDs:', currentUser.providerData.map(p => p.providerId).join(', '));
    
    try {
      const token = await currentUser.getIdToken(true);
      console.log('- Token obtained successfully (length:', token.length, ')');
      
      // Extract the Firebase token payload (the middle part of the JWT)
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          // JWT tokens have 3 parts: header.payload.signature
          // We're extracting the payload part and decoding it
          const payload = JSON.parse(atob(parts[1]));
          console.log('- Token payload:', {
            aud: payload.aud,
            auth_time: payload.auth_time,
            exp: payload.exp,
            iat: payload.iat,
            iss: payload.iss,
            sub: payload.sub,
            uid: payload.uid,
            firebase: payload.firebase ? 'present' : 'missing',
          });
        } catch (e) {
          console.error('Error parsing token payload:', e);
        }
      } else {
        console.error('Invalid token format - does not contain 3 parts');
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error('Firebase error getting token:', error.code, error.message);
      } else {
        console.error('Unknown error getting token:', error);
      }
    }
  }
  
  console.log('----------------------------------------------------------');
}

/**
 * Checks if a Firebase user has valid credentials
 */
export async function validateFirebaseUser(user: User | null): Promise<{
  isValid: boolean;
  message: string;
  token?: string;
}> {
  if (!user) {
    return { isValid: false, message: 'No user found' };
  }
  
  try {
    const token = await user.getIdToken(true);
    
    if (!token) {
      return { isValid: false, message: 'Empty token received' };
    }
    
    // Check if token is a valid JWT (has 3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { 
        isValid: false, 
        message: 'Invalid token format - does not contain 3 parts',
        token 
      };
    }
    
    return { 
      isValid: true, 
      message: 'User has valid Firebase credentials',
      token
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { 
      isValid: false, 
      message: `Error validating user: ${errorMessage}` 
    };
  }
}
