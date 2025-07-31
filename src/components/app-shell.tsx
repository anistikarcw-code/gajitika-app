'use client';
import { Home, History, Receipt, LayoutGrid, CheckCircle, LogOut as CheckOutIcon } from 'lucide-react';
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
  const { checkIns, addCheckIn, addCheckOut } = useCheckIn();
  const todayString = new Date().toISOString().split('T')[0];
  
  const todaysCheckIn = checkIns[todayString];
  const isCheckedIn = !!todaysCheckIn;
  const isCheckedOut = isCheckedIn && !!todaysCheckIn.checkOutTime;


  const navItemsLeft = [
    { icon: Home, label: 'Beranda', href: '/' },
    { icon: History, label: 'History Kerja', href: '/history' },
  ];
  const navItemsRight = [
    { icon: Receipt, label: 'Kerjaku', href: '/kerjaku' },
    { icon: LayoutGrid, label: 'Lainnya', href: '/lainnya' },
  ];

  const handleCheckInOut = () => {
    const now = new Date().toISOString();
    
    if (!isCheckedIn) {
      // Check-in logic
      addCheckIn(todayString, now);
      toast({
        title: 'Check-in Berhasil',
        description: `Anda telah berhasil check-in pada: ${new Date().toLocaleTimeString()}`,
      });
    } else if (!isCheckedOut) {
      // Check-out logic
      addCheckOut(todayString, now);
      toast({
        title: 'Check-out Berhasil',
        description: `Anda telah berhasil check-out pada: ${new Date().toLocaleTimeString()}`,
      });
    }
  };
  
  const getButtonContent = () => {
      if (!isCheckedIn) {
          return { icon: CheckCircle, label: 'Cek-in', disabled: false, buttonClass: 'bg-primary' };
      }
      if (!isCheckedOut) {
          return { icon: CheckOutIcon, label: 'Cek-out', disabled: false, buttonClass: 'bg-orange-500' };
      }
      return { icon: CheckCircle, label: 'Selesai', disabled: true, buttonClass: 'bg-green-500' };
  }

  const { icon: ButtonIcon, label: buttonLabel, disabled: isButtonDisabled, buttonClass } = getButtonContent();

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
              className={`w-16 h-16 rounded-full shadow-lg text-white transition-colors ${buttonClass}`}
              onClick={handleCheckInOut}
              disabled={isButtonDisabled}
            >
              <ButtonIcon className="w-8 h-8" />
            </Button>
            <span className="text-xs font-medium mt-1">{buttonLabel}</span>
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