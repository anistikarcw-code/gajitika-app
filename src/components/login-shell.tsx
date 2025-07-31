
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

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid.' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginShell() {
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    // In a real app, you would call your auth API here.
    // For now, we'll just simulate a successful login.
    login({ email: data.email, name: 'Pengguna Terhormat' });
    toast({
      title: 'Login Berhasil',
      description: 'Selamat datang kembali!',
    });
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-3xl overflow-hidden p-8 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-primary">GajiTika</h1>
                <p className="text-muted-foreground">Silakan masuk untuk melanjutkan</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    Masuk
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                    Daftar di sini
                </Link>
            </p>
        </div>
    </div>
  );
}
