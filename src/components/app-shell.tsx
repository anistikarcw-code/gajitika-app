'use client';
import { Home, History, Receipt, LayoutGrid, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCheckIn } from '@/hooks/use-check-in';

const NavItem = ({
  icon: Icon,
  label,
  isActive,
  href,
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  href: string;
}) => (
  <Link
    href={href}
    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
      isActive ? 'text-primary' : 'text-gray-400'
    }`}
  >
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
        isActive ? 'bg-primary/10' : 'bg-transparent'
      }`}
    >
      <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
    </div>
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

export default function AppShell({
  children,
  activeTab,
}: {
  children: React.ReactNode;
  activeTab: 'Beranda' | 'History Kerja' | 'Kerjaku' | 'Lainnya';
}) {
  const { toast } = useToast();
  const { addCheckIn, checkIns } = useCheckIn();
  const today = new Date().toISOString().split('T')[0];
  const isCheckedInToday = checkIns.includes(today);

  const navItemsLeft = [
    { icon: Home, label: 'Beranda', href: '/' },
    { icon: History, label: 'History Kerja', href: '/history' },
  ];
  const navItemsRight = [
    { icon: Receipt, label: 'Kerjaku', href: '/kerjaku' },
    { icon: LayoutGrid, label: 'Lainnya', href: '/lainnya' },
  ];

  const handleCheckIn = () => {
    if (!isCheckedInToday) {
      addCheckIn(today);
      toast({
        title: 'Check-in Berhasil',
        description: 'Anda telah berhasil check-in untuk hari ini.',
      });
    } else {
      toast({
        title: 'Sudah Check-in',
        description: 'Anda sudah melakukan check-in hari ini.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>
      <footer className="bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-3xl p-2 sticky bottom-0">
        <div className="flex justify-around items-center">
          {navItemsLeft.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeTab === item.label}
            />
          ))}
          <div className="flex flex-col items-center gap-1.5 -mt-8">
            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-primary shadow-lg text-white"
              onClick={handleCheckIn}
              disabled={isCheckedInToday}
            >
              <CheckCircle className="w-8 h-8" />
            </Button>
            <span className="text-xs font-medium mt-1">Cek-in</span>
          </div>
          {navItemsRight.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activeTab === item.label}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
