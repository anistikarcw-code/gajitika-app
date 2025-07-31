
'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const publicPaths = ['/login', '/register'];
  const noShellLayout = publicPaths.includes(pathname);

  // While waiting for auth state to resolve, path might be on a protected route.
  // We avoid rendering the shell until the AuthProvider has had a chance to redirect.
  if (!pathname) {
    return null; 
  }

  if (noShellLayout) {
    return <>{children}</>;
  }

  return (
    <main className="flex justify-center items-start min-h-screen bg-gray-100 p-0 md:p-4">
      <div className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-3xl overflow-hidden md:mt-8">
        {children}
      </div>
    </main>
  );
}
