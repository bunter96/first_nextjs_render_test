// frontend/src/pages/login.js
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { account } from '../../appwriteConfig';

export default function Login() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleOAuthLogin = async () => {
    try {
      // Initiates the OAuth login flow with Google.
      await account.createOAuth2Session('google', 'http://localhost:3000', 'http://localhost:3000');
    } catch (error) {
      console.error('OAuth login error:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in with your Google account to continue.
        </p>
        <button
          onClick={handleOAuthLogin}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C34.64 33.838 29.141 38 23 38c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.187 0 6.09 1.237 8.297 3.235l5.656-5.656C33.418 7.957 28.227 6 23 6 12.058 6 3 15.058 3 26s9.058 20 20 20 20-9.058 20-20c0-1.348-.138-2.66-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.557 4.802C14.189 15.053 18.557 12 23 12c3.187 0 6.09 1.237 8.297 3.235l5.656-5.656C33.418 7.957 28.227 6 23 6c-7.124 0-13.163 3.376-17.194 8.691z"
            />
            <path
              fill="#4CAF50"
              d="M23 44c5.757 0 10.6-2.24 14.133-5.857l-6.518-5.368C28.505 35.592 25.846 36 23 36c-4.395 0-8.104-2.85-9.419-6.806l-6.684 5.169C8.965 40.081 15.051 44 23 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-1.032 2.805-3.43 5-6.303 5-3.866 0-7-3.134-7-7s3.134-7 7-7c1.885 0 3.584.715 4.853 1.885l6.641-6.641C34.051 12.01 29.026 10 23 10 13.058 10 5 18.058 5 28s8.058 18 18 18 18-8.058 18-18c0-1.198-.138-2.36-.389-3.417z"
            />
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
}
