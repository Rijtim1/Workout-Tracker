// src/components/hooks/useAuth.js

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use the correct navigation hook
import { jwtDecode } from 'jwt-decode'; // Correct import to use named import

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/'); // Redirect to home page if no token found
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decodedToken.exp < currentTime) {
        // Token expired
        localStorage.removeItem('token'); // Clear the token from local storage
        router.push('/'); // Redirect to home page
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token'); // Clear the token from local storage
      router.push('/'); // Redirect to home page
    }
  }, [router]); // Dependency array to prevent unnecessary re-runs
};

export default useAuth;
