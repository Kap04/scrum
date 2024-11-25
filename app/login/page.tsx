'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/s');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message || 'Invalid credentials. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/s');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message || 'Google sign-in failed. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 p-4">
      <div className="w-full max-w-md bg-stone-800 rounded-lg text-gray-600 shadow-lg p-6">
        <h1 className="text-2xl font-bold text-zinc-300 text-center mb-6">Log In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Log In
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center bg-zinc-500 text-white py-3 rounded-lg hover:bg-zinc-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 12h-6m0 0H5m6 0a5 5 0 015 5m-5-5a5 5 0 01-5-5"
              />
            </svg>
            Log In with Google
          </button>
        </div>

        <p className="text-gray-600 text-sm text-center mt-4">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

