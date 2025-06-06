// context/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import { useRouter } from 'next/router';

interface User {
  id?: number | null;
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
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const verifyCalled = useRef(false);

  const fetchUser = async () => {
    if (verifyCalled.current) return;
    verifyCalled.current = true;

    try {
      const validateResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        credentials: 'include',
      });

      if (!validateResponse.ok) {
        setUser(null);
        localStorage.removeItem('user');
        return;
      }

      const profileResponse = await fetch('/api/auth/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (profileResponse.ok) {
        const data = await profileResponse.json();
        const newUser: User = {
          id: data.id || null,
          name: data.name,
          email: data.email,
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('fetchUser error:', error);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      localStorage.removeItem('user');
      router.push('/logowanie');
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
      const newUser: User = { id: data.id || null, name: username, email };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('User registered and logged in.');
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  // On mount, check for a saved user or a token to attempt fetching the user
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const hasToken = document.cookie.includes('token=');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (hasToken) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, []); // Empty dependency array to run only on mount

  return (
    <UserContext.Provider
      value={{ user, fetchUser, logout, register, setUser }}
    >
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
