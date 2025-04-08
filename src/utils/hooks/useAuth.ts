import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.includes('token=');

    if (!token) {
      router.push('/login'); 
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return { isAuthenticated };
};

export default useAuth;
