import React, { createContext, useState, useEffect, useContext } from 'react';
import { account, client } from '../../appwriteConfig';
import { Databases, Query } from 'appwrite';

export const AuthContext = createContext();

const DATABASE_ID = '67e86a96003df6c028d5';
const COLLECTION_ID = '67e86a9f00217c8a35a5';

const databases = new Databases(client);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAndCreateUserProfile = async (userData) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('user_email', userData.email)]
      );

      let profile;
      if (response.documents.length === 0) {
        profile = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          'unique()',
          {
            user_email: userData.email,
            plan_type: 'free',
            name: userData.name || '',
            is_active: true,
            char_allowed: 1000,
            char_remaining: 1000,
            current_plan_start_date: new Date().toISOString(),
            current_plan_expiry_date: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString(),
          }
        );
      } else {
        profile = response.documents[0];
      }
      return profile;
    } catch (error) {
      console.error('Error checking/creating user profile:', error);
      return null;
    }
  };

  const fetchUser = async () => {
    try {
      const userData = await account.get();
      if (userData) {
        const profile = await checkAndCreateUserProfile(userData);
        setUser({ ...userData, profile });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};