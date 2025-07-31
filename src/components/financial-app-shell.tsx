'use client';
import {
  Wallet,
  Star,
  CreditCard,
  HelpCircle,
  Pencil,
  ChevronRight,
  Phone,
  Ticket,
  MoreHorizontal,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import React from 'react';
import AppShell from './app-shell';
import { usePotongan } from '@/hooks/use-potongan';
import { useCheckIn } from '@/hooks/use-check-in';

const StatCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) => (
  <div className="bg-primary/10 rounded-lg p-3 flex-1">
    <div className="flex items-center gap-2 text-primary text-xs">
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
    <div className="font-bold text-sm text-primary-dark mt-1 flex items-center justify-between">
      <span>{value}</span>
      <ChevronRight className="w-4 h-4 text-primary/50" />
    </div>
  </div>
);

const ServiceIcon = ({
  icon: Icon,
  label,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  badge?: string;
}) => (
  <div className="flex flex-col items-center gap-2 relative">
    {badge && (
      <div className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white px-1 py-0.5 rounded-md">
        {badge}
      </div>
    )}
    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <span className="text-xs text-center text-foreground/80">{label}</span>
  </div>
);

export default function FinancialAppShell() {
  const [sliderValue, setSliderValue] = React.useState(75);
  const { bpjsKesehatanEnabled } = usePotongan();
  const { checkIns } = useCheckIn();

  const getPeriodDates = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let startDate, endDate;

    if (currentDay < 26) {
        startDate = new Date(currentYear, currentMonth - 1, 26);
        endDate = new Date(currentYear, currentMonth, 25);
    } else {
        startDate = new Date(currentYear, currentMonth, 26);
        endDate = new Date(currentYear, currentMonth + 1, 25);
    }
    return { startDate, endDate };
  }

  const { startDate, endDate } = getPeriodDates();

  const workdaysInPeriod = checkIns.filter(dateString => {
    const checkinDate = new Date(dateString);
    return checkinDate >= startDate && checkinDate <= endDate;
  }).length;
  
  const dailySalary = 111355;
  const totalGaji = workdaysInPeriod * dailySalary;

  const potonganBpjs = 93536;
  const gajiSetelahPotongan = bpjsKesehatanEnabled ? totalGaji - potonganBpjs : totalGaji;

  const withdrawalAmount = (gajiSetelahPotongan * sliderValue) / 100;

  const getPeriodString = () => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startDateString = startDate.toLocaleDateString('id-ID', options);
    const endDateString = endDate.toLocaleDateString('id-ID', options);
    return `${startDateString} - ${endDateString}`;
  }


  return (
    <AppShell activeTab="Beranda">
      <header className="bg-primary text-primary-foreground p-4 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">GajiTika</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-auto p-1 text-primary-foreground hover:bg-white/20"
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            Bantuan
          </Button>
        </div>
        <div className="flex justify-between items-center gap-2 mt-4">
          <StatCard icon={Star} title="Poin" value="100.000" />
          <StatCard icon={CreditCard} title="Kartu" value="Rp95" />
        </div>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="font-medium">perkiraan gajihmu</span>
            </div>

            <div className="flex justify-between items-baseline mb-2">
              <span className="text-3xl font-bold">
                Rp{new Intl.NumberFormat('id-ID').format(withdrawalAmount)}
              </span>
              <Pencil className="w-4 h-4 text-gray-400" />
            </div>

            <Slider
              value={[sliderValue]}
              onValueChange={(value) => setSliderValue(value[0])}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Rp0</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(gajiSetelahPotongan > 0 ? gajiSetelahPotongan : 0)}</span>
            </div>

            <Button className="w-full mt-4 font-bold" size="lg">
              Total Pendapatan
            </Button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Periode Gaji: {getPeriodString()} ({workdaysInPeriod} hari kerja)
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          <ServiceIcon icon={Wallet} label="E-Money" />
          <ServiceIcon icon={Phone} label="Pulsa" badge="Hemat 13%" />
          <ServiceIcon icon={Ticket} label="Voucher" badge="Hemat 13%" />
          <ServiceIcon icon={MoreHorizontal} label="Lainnya" />
        </div>

        <div className="bg-primary/20 text-primary-dark font-bold p-3 rounded-lg flex items-center justify-center gap-2">
          <span>Kamu Hemat Rp50.000</span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
