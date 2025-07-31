'use client';
import {
  Home,
  ArrowRightLeft,
  Receipt,
  LayoutGrid,
} from 'lucide-react';
import Link from 'next/link';

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
  <Link href={href} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary' : 'bg-transparent'}`}>
          <Icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
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
  const navItems = [
    { icon: Home, label: 'Beranda', href: '/' },
    { icon: ArrowRightLeft, label: 'History Kerja', href: '/history' },
    { icon: Receipt, label: 'Kerjaku', href: '/kerjaku' },
    { icon: LayoutGrid, label: 'Lainnya', href: '/lainnya' },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>
      <footer className="bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-3xl p-2 sticky bottom-0">
        <div className="flex justify-around items-start">
          {navItems.map((item) => (
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
