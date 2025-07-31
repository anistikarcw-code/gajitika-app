
'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // `useAuth` hook uses zustand/persist, which rehydrates from localStorage.
  // The initial server-side render will always have the default state (isLoggedIn: false).
  // The actual state is only known after hydration on the client.
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client. After it runs, we know the true
    // auth state has been rehydrated from localStorage.
    setLoading(false);
  }, []);

  useEffect(() => {
    // Wait until loading is false (i.e., auth state is rehydrated) before
    // running the redirect logic.
    if (loading) {
      return;
    }

    const publicPaths = ['/login', '/register', '/_offline'];
    const pathIsPublic = publicPaths.includes(pathname);

    if (!isLoggedIn && !pathIsPublic) {
      router.push('/login');
    } else if (isLoggedIn && pathIsPublic) {
      router.push('/');
    }
  }, [isLoggedIn, pathname, router, loading]);

  // While loading, return null to prevent rendering the wrong layout/page.
  // This is the key to preventing the server/client render mismatch.
  if (loading) {
    return null;
  }
  
  // Also, prevent rendering children if a redirect is imminent.
  const publicPaths = ['/login', '/register', '/_offline'];
  const pathIsPublic = publicPaths.includes(pathname);
  if ((!isLoggedIn && !pathIsPublic) || (isLoggedIn && pathIsPublic)) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};
