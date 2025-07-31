
'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Kita perlu memastikan kode ini hanya berjalan di klien
    if (typeof window === 'undefined') return;

    const publicPaths = ['/login', '/register', '/_offline'];
    const pathIsPublic = publicPaths.includes(pathname);
    
    // Jika pengguna tidak login dan mencoba mengakses halaman yang dilindungi
    if (!isLoggedIn && !pathIsPublic) {
      router.push('/login');
    } 
    // Jika pengguna sudah login dan mencoba mengakses halaman publik (seperti login/register)
    else if (isLoggedIn && pathIsPublic) {
      router.push('/');
    }

  }, [isLoggedIn, pathname, router]);

  // Untuk mencegah render anak-anak sebelum pengalihan sempat terjadi,
  // kita bisa menambahkan pengecekan di sini. Jika pengalihan akan segera terjadi, kita tidak merender apa pun.
  const isRedirecting = (!isLoggedIn && !['/login', '/register', '/_offline'].includes(pathname)) || (isLoggedIn && ['/login', '/register'].includes(pathname));

  if (isRedirecting) {
    return null; // atau spinner pemuatan
  }

  return <>{children}</>;
};
