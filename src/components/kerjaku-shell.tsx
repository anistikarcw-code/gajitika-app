'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import React from 'react';
import AppShell from './app-shell';
import { Briefcase } from 'lucide-react';

export default function KerjakuShell() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <AppShell activeTab="Kerjaku">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 rounded-b-3xl">
        <Briefcase className="w-6 h-6" />
        <h1 className="text-xl font-bold">Kerjaku</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <Card>
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rumus Kerja</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Senin - Jumat</span>
              <span className="font-medium">Rp 111.355 / hari (9 jam)</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Sabtu - Minggu</span>
              <span className="font-medium">Rp 18.000 / jam (Lembur)</span>
            </div>
             <div className="flex justify-between">
              <span className="text-muted-foreground">Lebih dari 9 jam</span>
              <span className="font-medium">Rp 18.000 / jam (Lembur)</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
