import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';

interface User {
  name: string | null;
  email: string | null;
}

interface UserContextProps {
  user: User | null;
  fetchUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    if (user) return; // Avoid redundant API calls if the user is already loaded
    try {
      console.log('Verifying token...');
      const validateResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        credentials: 'include',
      });

      if (!validateResponse.ok) {
        console.warn('Token is invalid. User is not authenticated.');
        setUser(null);
        localStorage.removeItem('user'); // Clear stale user data
        return;
      }

      console.log('Fetching user profile...');
      const profileResponse = await fetch('/api/auth/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (profileResponse.ok) {
        const data = await profileResponse.json();
        setUser({ name: data.name, email: data.email });
        localStorage.setItem(
          'user',
          JSON.stringify({ name: data.name, email: data.email }),
        ); // Persist user data
        console.log('Fetched user profile:', data);
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      localStorage.removeItem('user'); // Clear persisted user data
      router.push('/logowanie'); // Redirect to logowanie after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Restore user from localStorage
    } else {
      fetchUser(); // Fetch user if not found in localStorage
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
