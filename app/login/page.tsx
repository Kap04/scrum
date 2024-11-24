'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebase/config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function for logging in with email and password
  const handleLogin = async () => {
    try {
      setError(null); // Clear previous errors
      await signInWithEmailAndPassword(auth, email, password);
      alert('User logged in successfully!');
      router.push('/s'); // Redirect to dashboard after successful login
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  // Function for Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Logged in with Google successfully!');
      router.push('/s'); // Redirect to dashboard after successful login
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg text-gray-600 shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Log In</h1>
        <div className="space-y-4">
          {/* Email Field */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* Password Field */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}
          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Log In
          </button>
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
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
        {/* Redirect to Signup */}
        <p className="text-gray-600 text-sm text-center mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
