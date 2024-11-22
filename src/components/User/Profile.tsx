import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Profile = () => {
  const [user, setUser] = useState<any>(null); // Replace `any` with a proper user type if possible
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          router.push('/logowanie'); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        router.push('/logowanie'); // Redirect to login if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="/icons/spinner.gif"
          alt="Loading..."
          className="h-10 w-10 animate-spin"
        />
      </div>
    );
  }

  if (!user) {
    return null; // User not logged in or data fetching failed
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">
        Witaj, {user.name || user.username}
      </h2>
      <p className="text-gray-600">Email: {user.email}</p>
      <div className="mt-6">
        <h3 className="text-lg font-medium">Twoje dane:</h3>
        <ul className="list-disc pl-6 mt-2">
          <li>Username: {user.username}</li>
          <li>Email: {user.email}</li>
          <li>Other user-specific details...</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
