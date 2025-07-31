
'use client'
import FinancialAppShell from '@/components/financial-app-shell';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { isLoggedIn } = useAuth();
  
  // The AuthProvider in RootLayout handles the redirect.
  // We return null to prevent rendering anything until the redirect happens.
  if (!isLoggedIn) {
    return null;
  }
  
  return <FinancialAppShell />;
}
