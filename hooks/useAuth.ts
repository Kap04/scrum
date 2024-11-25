import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged, User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email
        });
      } else {
        setUser(null);
      }
      setLoading(false);  // Set loading to false after Firebase auth state is checked
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Only redirect after Firebase has processed the user state
      if (!loading) {
        router.push('/s');
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Only redirect after Firebase has processed the user state
      if (!loading) {
        router.push('/s');
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  return { 
    user, 
    loading,
    signIn,
    signUp,
    signOut
  } as const;
};
