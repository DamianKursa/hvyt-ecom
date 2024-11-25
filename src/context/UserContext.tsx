import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

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

  const fetchUser = async () => {
    try {
      console.log('Verifying token...');
      const validateResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        credentials: 'include',
      });

      if (!validateResponse.ok) {
        console.warn('Token invalid. Clearing user data.');
        setUser(null);
        return;
      }

      console.log('Fetching user profile...');
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user profile:', data);
        setUser({ name: data.name, email: data.email });
      } else {
        console.warn('Failed to fetch user profile:', response.status);
        setUser(null);
      }
    } catch (error) {
      console.error('Error in fetchUser:', error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setUser(null); // Clear the user state
        console.log('Logged out successfully');
      } else {
        console.error('Failed to log out:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('Updated user state:', user);
  }, [user]);

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
