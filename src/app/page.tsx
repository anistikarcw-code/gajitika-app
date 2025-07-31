
'use client'
import FinancialAppShell from '@/components/financial-app-shell';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    // AuthProvider in AppLayout will handle the redirect.
    // Return null or a loading spinner to prevent rendering the page content briefly before redirecting.
    return null;
  }
  
  return <FinancialAppShell />;
}
