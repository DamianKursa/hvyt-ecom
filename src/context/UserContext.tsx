import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';

// Updated User interface to include id (optional)
interface User {
  id?: number | null; // Optional id field
  name: string | null;
  email: string | null;
}

interface UserContextProps {
  user: User | null;
  fetchUser: () => void;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
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
        setUser({ id: data.id || null, name: data.name, email: data.email }); // Include id
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: data.id || null,
            name: data.name,
            email: data.email,
          }),
        ); // Persist user data including id
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

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      // Automatically log in the user after registration
      setUser({ id: data.id || null, name: username, email }); // Include id
      localStorage.setItem(
        'user',
        JSON.stringify({ id: data.id || null, name: username, email }),
      ); // Persist user data including id

      console.log('User registered and logged in.');
    } catch (error) {
      console.error('Error during registration:', error);
      throw error; // Rethrow error for the caller to handle
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
    <UserContext.Provider value={{ user, fetchUser, logout, register }}>
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
