'use client';
import React from 'react';
import AppShell from './app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCheckIn } from '@/hooks/use-check-in';
import { History, Download, Printer, Clock, LogOut } from 'lucide-react';
import { Separator } from './ui/separator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function HistoryShell() {
  const { checkIns } = useCheckIn();
  const dailySalary = 111355;
  const overtimeRatePerHour = 18000;

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

  const workdaysInPeriod = Object.keys(checkIns)
    .filter(dateString => {
        const checkinDate = new Date(dateString);
        return checkinDate >= startDate && checkinDate <= endDate;
    })
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map(dateString => ({ date: dateString, ...checkIns[dateString] }));

  const calculateDaySalary = (entry: typeof workdaysInPeriod[0]) => {
      if (!entry.checkOutTime) return { baseSalary: 0, overtimePay: 0, total: 0, workHours: 0 };
      
      const checkInTime = new Date(entry.checkInTime);
      const checkOutTime = new Date(entry.checkOutTime);
      const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      const baseSalary = dailySalary;
      let overtimePay = 0;
      if (workHours > 9) {
          const overtimeHours = workHours - 9;
          overtimePay = overtimeHours * overtimeRatePerHour;
      }
      return { baseSalary, overtimePay, total: baseSalary + overtimePay, workHours };
  }
  
  const totalGaji = workdaysInPeriod.reduce((total, entry) => total + calculateDaySalary(entry).total, 0);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

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
    const reportElement = document.getElementById('history-report');
    if (reportElement) {
      html2canvas(reportElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Laporan_GajiTika_${getPeriodString()}.pdf`);
      });
    }
  };

  return (
    <AppShell activeTab="History Kerja">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 rounded-b-3xl">
        <History className="w-6 h-6" />
        <h1 className="text-xl font-bold">History Kerja</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <div id="history-report">
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
            </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Rincian Kehadiran</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {workdaysInPeriod.length > 0 ? (
                            workdaysInPeriod.map((entry, index) => {
                                const { total, workHours, overtimePay } = calculateDaySalary(entry);
                                return (
                                <React.Fragment key={entry.date}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{formatDate(entry.date)}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {formatTime(entry.checkInTime)}</span>
                                                <span className="flex items-center gap-1"><LogOut className="w-3 h-3"/> {formatTime(entry.checkOutTime)}</span>
                                            </div>
                                            <p className="text-sm text-green-600 mt-1">Hadir ({workHours.toFixed(1)} jam)</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-primary">{formatCurrency(total)}</p>
                                            <p className="text-xs text-muted-foreground">Gaji Harian</p>
                                            {overtimePay > 0 && <p className="text-xs text-blue-500">Lembur: {formatCurrency(overtimePay)}</p>}
                                        </div>
                                    </div>
                                    {index < workdaysInPeriod.length - 1 && <Separator />}
                                </React.Fragment>
                                )
                            })
                        ) : (
                            <p className="text-center text-muted-foreground">Belum ada data check-in pada periode ini.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="flex gap-2 mt-4">
            <Button variant="outline" className="w-full" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Cetak
            </Button>
            <Button className="w-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Unduh
            </Button>
        </div>
      </main>
    </AppShell>
  );
}