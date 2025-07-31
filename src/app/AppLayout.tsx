
'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const publicPaths = ['/login', '/register', '/_offline'];
    const pathIsPublic = publicPaths.includes(pathname);

    if (!isLoggedIn && !pathIsPublic) {
      router.push('/login');
    } else if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
      router.push('/');
    }
  }, [isLoggedIn, pathname, router]);

  const isRedirecting = (!isLoggedIn && !['/login', '/register', '/_offline'].includes(pathname)) || (isLoggedIn && (pathname === '/login' || pathname === '/register'));
  if (isRedirecting) {
    return null;
  }

  return <>{children}</>;
};


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const publicPaths = ['/login', '/register', '/_offline'];
  const noShellLayout = publicPaths.includes(pathname);

  return (
    <AuthProvider>
      {noShellLayout ? (
        <>{children}</>
      ) : (
        <main className="flex justify-center items-start min-h-screen bg-gray-100 p-0 md:p-4">
          <div className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-3xl overflow-hidden md:mt-8">
            {children}
          </div>
        </main>
      )}
    </AuthProvider>
  );
}
