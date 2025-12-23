'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, LoginFormData } from '@/lib/validations';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await authApi.login(data);
      const { token, user } = response.data.data;

      // Salva token no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redireciona para o dashboard
      router.push('/admin/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Header / Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-4 shadow-sm z-10">
        <div className="flex items-center gap-3 text-[#0d141b] dark:text-white">
          <Logo />
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Sistema de Leads</h2>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="#" className="hover:text-primary transition-colors">Ajuda</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contato</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-300/10 dark:bg-blue-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>

        {/* Login Card */}
        <div className="relative w-full max-w-[480px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          {/* Headline Section */}
          <div className="px-8 pt-10 pb-4 text-center">
            <h2 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight">
              Acesse sua conta
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal pt-2">
              Gerencie seus leads de forma eficiente.
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10 flex flex-col gap-5">
            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Email Field */}
              <label className="flex flex-col w-full">
                <p className="text-slate-900 dark:text-slate-200 text-base font-medium leading-normal pb-2">
                  E-mail
                </p>
                <Input
                  type="email"
                  {...register('email')}
                  className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 px-4 text-base font-normal leading-normal transition-all"
                  placeholder="exemplo@empresa.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </label>

              {/* Password Field */}
              <label className="flex flex-col w-full">
                <div className="flex justify-between items-center pb-2">
                  <p className="text-slate-900 dark:text-slate-200 text-base font-medium leading-normal">
                    Senha
                  </p>
                </div>
                <div className="relative flex w-full items-stretch rounded-lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 pl-4 pr-12 text-base font-normal leading-normal transition-all"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 flex items-center justify-center pr-4 cursor-pointer text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
                {/* Forgot Password Link aligned right */}
                <div className="flex justify-end pt-2">
                  <Link
                    href="#"
                    className="text-sm font-medium text-primary hover:text-blue-600 transition-colors"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
              </label>

              {/* Action Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="flex justify-center items-center pt-2">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Não tem uma conta?{' '}
                <Link href="#" className="text-primary font-bold hover:underline ml-1">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-4 text-center text-xs text-slate-400">
          © 2025 Sistema de Leads. Todos os direitos reservados. Criador: Lucas Emanuel
        </div>
      </main>
    </div>
  );
}
