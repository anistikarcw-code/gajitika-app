'use client';
import React from 'react';
import AppShell from './app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCheckIn } from '@/hooks/use-check-in';
import { History, Download, Printer, ChevronRight } from 'lucide-react';
import { Separator } from './ui/separator';

export default function HistoryShell() {
  const { checkIns } = useCheckIn();
  const dailySalary = 111355;

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
  }).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const totalGaji = workdaysInPeriod.length * dailySalary;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPeriodString = () => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const startDateString = startDate.toLocaleDateString('id-ID', options);
    const endDateString = endDate.toLocaleDateString('id-ID', options);
    return `${startDateString} - ${endDateString}`;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Fungsi unduh PDF akan segera tersedia!');
  };

  return (
    <AppShell activeTab="History Kerja">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 rounded-b-3xl">
        <History className="w-6 h-6" />
        <h1 className="text-xl font-bold">History Kerja</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Periode Saat Ini</span>
              <span className="text-sm font-normal text-muted-foreground">{getPeriodString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                <p className="text-2xl font-bold">{formatCurrency(totalGaji)}</p>
              </div>
              <div className="text-right">
                 <p className="text-sm text-muted-foreground">Total Hari Kerja</p>
                 <p className="text-2xl font-bold">{workdaysInPeriod.length}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
                <Button variant="outline" className="w-full" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" /> Cetak
                </Button>
                <Button className="w-full" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" /> Unduh
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Rincian Kehadiran</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {workdaysInPeriod.length > 0 ? (
                        workdaysInPeriod.map(checkin => (
                            <React.Fragment key={checkin}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{formatDate(checkin)}</p>
                                        <p className="text-sm text-green-600">Hadir</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary">{formatCurrency(dailySalary)}</p>
                                        <p className="text-xs text-muted-foreground">Gaji Harian</p>
                                    </div>
                                </div>
                                <Separator />
                            </React.Fragment>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground">Belum ada data check-in pada periode ini.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
