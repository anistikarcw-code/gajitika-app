'use client';
import React from 'react';
import AppShell from './app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpenses } from '@/hooks/use-expenses';
import { FileText, Trash2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

export default function LaporanPengeluaranShell() {
  const { expenses, removeExpense } = useExpenses();

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
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

  return (
    <AppShell activeTab="Lainnya">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 rounded-b-3xl">
        <FileText className="w-6 h-6" />
        <h1 className="text-xl font-bold">Laporan Pengeluaran</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Total Pengeluaran</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rincian Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.length > 0 ? (
                expenses
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense, index) => (
                    <React.Fragment key={expense.id}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(expense.date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <p className="font-semibold text-destructive">{formatCurrency(expense.amount)}</p>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeExpense(expense.id)}>
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                      </div>
                      {index < expenses.length - 1 && <Separator />}
                    </React.Fragment>
                  ))
              ) : (
                <p className="text-center text-muted-foreground">Belum ada data pengeluaran.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
