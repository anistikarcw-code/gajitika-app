
'use client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const pathIsPublic = publicPaths.includes(pathname);

    if (!isLoggedIn && !pathIsPublic) {
      router.push('/login');
    } else if (isLoggedIn && pathIsPublic) {
      router.push('/');
    }
  }, [isLoggedIn, pathname, router]);

  return <>{children}</>;
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noShellLayout = ['/login', '/register'].includes(pathname);

  return (
    <AuthProvider>
      {noShellLayout ? (
        children
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
