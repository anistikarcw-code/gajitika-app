'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const publicPaths = ['/login', '/register', '/_offline'];
    const pathIsPublic = publicPaths.includes(pathname);
    
    if (!isLoggedIn && !pathIsPublic) {
      router.push('/login');
    } 
    else if (isLoggedIn && pathIsPublic) {
      router.push('/');
    }

  }, [isLoggedIn, pathname, router]);
  
  // Mencegah render konten yang salah saat pengalihan akan terjadi.
  // Ini adalah pemeriksaan kunci untuk mencegah perulangan render di server.
  if (typeof window !== 'undefined') {
    const publicPaths = ['/login', '/register', '/_offline'];
    const pathIsPublic = publicPaths.includes(pathname);

    if (!isLoggedIn && !pathIsPublic) {
      return null; // atau spinner pemuatan
    }
    if (isLoggedIn && pathIsPublic) {
      return null; // atau spinner pemuatan
    }
  }


  return <>{children}</>;
};
