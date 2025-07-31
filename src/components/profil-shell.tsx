
'use client';
import React from 'react';
import AppShell from './app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { User, Mail, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

const ProfileItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <div className="flex items-center gap-4 py-3">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
);


export default function ProfilShell() {
  const { user } = useAuth();

  if (!user) {
    return (
        <AppShell activeTab="Lainnya">
             <div className="p-4">
                <p>Silakan login untuk melihat profil.</p>
             </div>
        </AppShell>
    );
  }

  return (
    <AppShell activeTab="Lainnya">
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-4 rounded-b-3xl">
        <User className="w-6 h-6" />
        <h1 className="text-xl font-bold">Profil Saya</h1>
      </header>

      <main className="flex-grow p-4 space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://placehold.co/100x100.png`} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
                <ProfileItem icon={User} label="Nama Lengkap" value={user.name} />
                <ProfileItem icon={Mail} label="Alamat Email" value={user.email} />
                <ProfileItem icon={Shield} label="Kata Sandi" value="••••••••" />
            </CardContent>
        </Card>

        <Button variant="outline" className="w-full">
            Edit Profil
        </Button>

      </main>
    </AppShell>
  );
}
