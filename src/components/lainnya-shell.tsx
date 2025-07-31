'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Shield, Briefcase, Link as LinkIcon, Bell, User, LogOut, LayoutGrid, RefreshCw } from 'lucide-react';
import AppShell from './app-shell';
import { usePotongan } from '@/hooks/use-potongan';
import { useCheckIn } from '@/hooks/use-check-in';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';


const SettingsItem = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children?: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <span className="font-medium">{label}</span>
    </div>
    <div>{children}</div>
  </div>
);

const ClickableSettingsItem = ({ icon: Icon, label, onClick, className }: { icon: React.ElementType; label: string; onClick?: () => void, className?: string }) => (
    <button onClick={onClick} className={`w-full ${className}`}>
        <SettingsItem icon={Icon} label={label}>
            <ChevronRight className="w-5 h-5" />
        </SettingsItem>
    </button>
);


export default function LainnyaShell() {
  const { bpjsKesehatanEnabled, setBpjsKesehatanEnabled, bpjsKetenagakerjaanEnabled, setBpjsKetenagakerjaanEnabled, resetPotongan } = usePotongan();
  const { resetCheckIns } = useCheckIn();
  const { toast } = useToast();

  const handleResetData = () => {
    resetCheckIns();
    resetPotongan();
    toast({
        title: "Data Direset",
        description: "Semua data aplikasi telah berhasil direset.",
    });
  };

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
                <Switch 
                  checked={bpjsKesehatanEnabled} 
                  onCheckedChange={setBpjsKesehatanEnabled} 
                />
              </SettingsItem>
              <SettingsItem icon={Shield} label="BPJS Ketenagakerjaan">
                <Switch 
                   checked={bpjsKetenagakerjaanEnabled} 
                   onCheckedChange={setBpjsKetenagakerjaanEnabled}
                />
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
          <CardContent className="p-0 divide-y">
             <div className="px-6 text-red-500">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <ClickableSettingsItem icon={RefreshCw} label="Reset Data" className="text-red-500"/>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus semua data aplikasi, termasuk riwayat check-in dan pengaturan. Tindakan ini tidak dapat diurungkan.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetData} className={Button({variant: "destructive"})} >Reset</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
             <div className="px-6 text-red-500">
               <ClickableSettingsItem icon={LogOut} label="Keluar" className="text-red-500"/>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
