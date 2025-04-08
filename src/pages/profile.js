import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Client, Databases, Query, Account } from "appwrite";

export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [profilePic, setProfilePic] = useState("/default-avatar.png");

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const databases = new Databases(client);
  const account = new Account(client);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_USER_PROFILE_DATABASE_ID,
            process.env.NEXT_PUBLIC_USER_PROFILE_COLLECTION_ID,
            [Query.equal("user_email", [user.email])]
          );

          if (response.documents.length > 0) {
            setProfile(response.documents[0]);
          }

          const session = await account.getSession("current");
          const accessToken = session.providerAccessToken;

          if (accessToken) {
            const googleResponse = await fetch(
              "https://www.googleapis.com/oauth2/v2/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            const googleData = await googleResponse.json();
            setProfilePic(googleData.picture || "/default-avatar.png");
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };

    fetchProfile();
  }, [user, databases, account]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-6 mb-6">
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-300"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile?.name || "User Name"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {profile?.user_email || "user@example.com"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Plan Details
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Plan Type:</strong> {profile?.plan_type || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Active:</strong>{" "}
              {profile?.is_active ? "Yes" : "No"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Characters Allowed:</strong>{" "}
              {profile?.char_allowed || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Characters Remaining:</strong>{" "}
              {profile?.char_remaining || "N/A"}
            </p>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Subscription Dates
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Plan Start Date:</strong>{" "}
              {profile?.current_plan_start_date
                ? new Date(profile.current_plan_start_date).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Plan Expiry Date:</strong>{" "}
              {profile?.current_plan_expiry_date
                ? new Date(profile.current_plan_expiry_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
