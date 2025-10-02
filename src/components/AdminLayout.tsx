'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Menu, X, BarChart3, Users, Settings } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Verifica autenticação
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <p className="text-sm text-gray-500">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                Painel Administrativo
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Sistema de Leads</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800 truncate max-w-32">{user.email}</p>
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
            <div className="sm:hidden">
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-red-50 text-red-600 hover:text-red-700"
              title="Sair"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)] border-r"
          >
            <nav className="p-4 space-y-2">
              <a
                href="/admin/dashboard"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group"
              >
                <BarChart3 size={20} className="text-gray-500 group-hover:text-primary" />
                <span className="font-medium">Dashboard</span>
              </a>
              <a
                href="/admin/leads"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group"
              >
                <Users size={20} className="text-gray-500 group-hover:text-primary" />
                <span className="font-medium">Leads</span>
              </a>
              <Separator className="my-4" />
              <a
                href="/admin/settings"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group"
              >
                <Settings size={20} className="text-gray-500 group-hover:text-primary" />
                <span className="font-medium">Configurações</span>
              </a>
            </nav>
          </motion.aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


