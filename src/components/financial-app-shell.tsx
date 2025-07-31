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
  Clock,
  ClipboardList,
  ShoppingBasket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import React from 'react';
import AppShell from './app-shell';
import { usePotongan } from '@/hooks/use-potongan';
import { useCheckIn } from '@/hooks/use-check-in';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from './ui/input';
import { useNotes } from '@/hooks/use-notes';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import { useExpenses } from '@/hooks/use-expenses';
import { Label } from './ui/label';

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
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  badge?: string;
  onClick?: () => void;
}) => (
  <div
    className="flex flex-col items-center gap-2 relative"
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
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
  const { checkIns, addCheckOut } = useCheckIn();
  const [isEditTimeOpen, setIsEditTimeOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [newTime, setNewTime] = React.useState('');
  const [isNoteDialogOpen, setIsNoteDialogOpen] = React.useState(false);
  const [newNote, setNewNote] = React.useState('');
  const { addNote } = useNotes();
  const { toast } = useToast();
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = React.useState(false);
  const [expenseAmount, setExpenseAmount] = React.useState('');
  const [expenseDescription, setExpenseDescription] = React.useState('');
  const { addExpense } = useExpenses();

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
  };

  const { startDate, endDate } = getPeriodDates();

  const workdaysInPeriod = Object.keys(checkIns).filter((dateString) => {
    const checkinDate = new Date(dateString);
    return checkinDate >= startDate && checkinDate <= endDate;
  });

  const dailySalary = 111355;
  const overtimeRatePerHour = 18000;

  const totalGaji = workdaysInPeriod.reduce((total, dateString) => {
    const entry = checkIns[dateString];
    if (!entry.checkOutTime) return total; // Don't count incomplete days

    const checkInTime = new Date(entry.checkInTime);
    const checkOutTime = new Date(entry.checkOutTime);
    const workHours =
      (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    let daySalary = dailySalary; // Assume it's a normal workday for base salary
    if (workHours > 9) {
      const overtimeHours = workHours - 9;
      daySalary += overtimeHours * overtimeRatePerHour;
    }
    return total + daySalary;
  }, 0);

  const potonganBpjs = 93536;
  const gajiSetelahPotongan = bpjsKesehatanEnabled
    ? totalGaji - potonganBpjs
    : totalGaji;

  const withdrawalAmount = (gajiSetelahPotongan * sliderValue) / 100;

  const getPeriodString = () => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
    };
    const startDateString = startDate.toLocaleDateString('id-ID', options);
    const endDateString = endDate.toLocaleDateString('id-ID', options);
    return `${startDateString} - ${endDateString}`;
  };

  const datesWithoutCheckout = Object.keys(checkIns)
    .filter((date) => !checkIns[date].checkOutTime)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleEditTimeSubmit = () => {
    if (!selectedDate || !newTime) return;

    const [hours, minutes] = newTime.split(':').map(Number);
    const checkoutDateTime = new Date(selectedDate);
    checkoutDateTime.setHours(hours, minutes, 0, 0);

    addCheckOut(selectedDate, checkoutDateTime.toISOString());

    setIsEditTimeOpen(false);
    setSelectedDate('');
    setNewTime('');
  };

  const openEditTimeDialog = () => {
    if (datesWithoutCheckout.length > 0) {
      setSelectedDate(datesWithoutCheckout[0]);
    }
    setIsEditTimeOpen(true);
  };

  const handleNoteSubmit = () => {
    if (!newNote.trim()) return;
    addNote({
      id: Date.now().toString(),
      text: newNote,
      createdAt: new Date().toISOString(),
    });
    toast({
      title: "Catatan Ditambahkan",
      description: newNote,
    });
    setNewNote('');
    setIsNoteDialogOpen(false);
  }

  const handleExpenseSubmit = () => {
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0 || !expenseDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Input Tidak Valid",
        description: "Mohon masukkan jumlah dan deskripsi pengeluaran yang valid.",
      });
      return;
    }
    addExpense({
      id: Date.now().toString(),
      amount,
      description: expenseDescription,
      date: new Date().toISOString(),
    });
    toast({
      title: "Pengeluaran Ditambahkan",
      description: `${expenseDescription}: Rp${new Intl.NumberFormat('id-ID').format(amount)}`,
    });
    setExpenseAmount('');
    setExpenseDescription('');
    setIsExpenseDialogOpen(false);
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
              <span>
                Rp
                {new Intl.NumberFormat('id-ID').format(
                  gajiSetelahPotongan > 0 ? gajiSetelahPotongan : 0
                )}
              </span>
            </div>

            <Button className="w-full mt-4 font-bold" size="lg">
              Total Pendapatan
            </Button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Periode Gaji: {getPeriodString()} ({workdaysInPeriod.length} hari
              kerja)
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          <ServiceIcon icon={Clock} label="Edit Waktu" onClick={openEditTimeDialog} />
          <ServiceIcon icon={ClipboardList} label="Catatan" onClick={() => setIsNoteDialogOpen(true)}/>
          <ServiceIcon icon={ShoppingBasket} label="Pengeluaranku" onClick={() => setIsExpenseDialogOpen(true)} />
          <ServiceIcon icon={MoreHorizontal} label="Lainnya" />
        </div>
      </main>

      <Dialog open={isEditTimeOpen} onOpenChange={setIsEditTimeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Waktu Check-out</DialogTitle>
            <DialogDescription>
              Pilih tanggal dan masukkan waktu check-out yang terlupa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={setSelectedDate} value={selectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tanggal" />
              </SelectTrigger>
              <SelectContent>
                {datesWithoutCheckout.map((date) => (
                  <SelectItem key={date} value={date}>
                    {new Date(date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleEditTimeSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Catatan Baru</DialogTitle>
            <DialogDescription>
              Tulis agenda atau pengingat Anda. Catatan ini akan muncul sebagai notifikasi.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="Ketik catatan Anda di sini..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleNoteSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pengeluaran</DialogTitle>
            <DialogDescription>
              Catat pengeluaran baru Anda di sini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-amount" className="text-right">
                    Jumlah
                </Label>
                <Input
                    id="expense-amount"
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 50000"
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-description" className="text-right">
                    Deskripsi
                </Label>
                <Input
                    id="expense-description"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="e.g. Makan siang"
                    className="col-span-3"
                />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleExpenseSubmit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
