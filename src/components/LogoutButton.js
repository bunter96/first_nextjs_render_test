// frontend/src/components/LogoutButton.js
import React, { useContext } from 'react';
import { account } from '../../appwriteConfig';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function LogoutButton() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Delete the current session
      await account.deleteSession('current');
      // Clear the user from the auth context
      setUser(null);
      // Optionally redirect the user after logout
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
