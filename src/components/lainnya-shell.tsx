'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Shield, Briefcase, Link as LinkIcon, Bell, User, LogOut, LayoutGrid } from 'lucide-react';
import AppShell from './app-shell';

const SettingsItem = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children?: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="font-medium">{label}</span>
    </div>
    <div>{children}</div>
  </div>
);

export default function LainnyaShell() {
  return (
    <AppShell activeTab="Lainnya">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 rounded-b-3xl">
        <LayoutGrid className="w-6 h-6" />
        <h1 className="text-xl font-bold">Lainnya</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Potongan Kerja</h3>
              <SettingsItem icon={Shield} label="BPJS Kesehatan">
                <Switch defaultChecked />
              </SettingsItem>
              <SettingsItem icon={Shield} label="BPJS Ketenagakerjaan">
                <Switch />
              </SettingsItem>
            </div>
            
            <Separator className="my-4" />

            <div className="px-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sinkronisasi</h3>
              <SettingsItem icon={LinkIcon} label="Hubungkan ke Pendapatan Kerja">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </SettingsItem>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
             <div className="px-6 pt-4">
               <SettingsItem icon={Briefcase} label="Pusat Bantuan">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
               </SettingsItem>
               <Separator />
                <SettingsItem icon={User} label="Profil Saya">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
               </SettingsItem>
               <Separator />
                <SettingsItem icon={Bell} label="Notifikasi">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
               </SettingsItem>
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardContent className="p-0">
             <div className="px-6 pt-4 text-red-500">
               <SettingsItem icon={LogOut} label="Keluar">
                  <ChevronRight className="w-5 h-5" />
               </SettingsItem>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
