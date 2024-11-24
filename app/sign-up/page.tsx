'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import {  useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function for signing up with email and password
  const handleSignup = async () => {
    try {
      setError(null); // Clear previous errors
      await createUserWithEmailAndPassword(auth, email, password);
      alert('User signed up successfully!');
      router.push('/s'); // Redirect to dashboard after successful signup
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  // Function for Google Sign-In
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Signed in with Google successfully!');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg text-gray-600 shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h1>
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
          {/* Signup Button */}
          <button
            onClick={handleSignup}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
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
            Sign Up with Google
          </button>
        </div>
        {/* Redirect to Login */}
        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
