
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter.' }),
  email: z.string().email({ message: 'Email tidak valid.' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterShell() {
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    // In a real app, you would call your registration API here.
    // For now, we'll just log the user in directly.
    login({ email: data.email, name: data.name });
    toast({
      title: 'Pendaftaran Berhasil',
      description: `Selamat datang, ${data.name}!`,
    });
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-3xl overflow-hidden p-8 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-primary">Buat Akun Baru</h1>
                <p className="text-muted-foreground">Daftar untuk mulai menggunakan GajiTika.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nama Lengkap Anda"
                        {...register('name')}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="email@contoh.com"
                        {...register('email')}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Kata Sandi</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full !mt-6">
                    Daftar
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Masuk di sini
                </Link>
            </p>
        </div>
    </div>
  );
}
