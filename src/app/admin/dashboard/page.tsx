'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { leadsApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, UserX, TrendingUp, BarChart3, ExternalLink } from 'lucide-react';

interface Stats {
  total: number;
  active: number;
  inactive: number;
  thisMonth: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await leadsApi.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Leads',
      value: stats?.total || 0,
      icon: <Users size={24} />,
      color: 'bg-blue-500',
      description: 'Leads cadastrados',
    },
    {
      title: 'Leads Ativos',
      value: stats?.active || 0,
      icon: <UserCheck size={24} />,
      color: 'bg-green-500',
      description: 'Leads ativos no sistema',
    },
    {
      title: 'Leads Inativos',
      value: stats?.inactive || 0,
      icon: <UserX size={24} />,
      color: 'bg-red-500',
      description: 'Leads desativados',
    },
    {
      title: 'Leads Este Mês',
      value: stats?.thisMonth || 0,
      icon: <TrendingUp size={24} />,
      color: 'bg-purple-500',
      description: 'Novos leads este mês',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Visão geral do sistema de leads</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {card.title}
                    </CardTitle>
                    <div className={`${card.color} text-white p-2 rounded-lg`}>
                      {card.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {card.value}
                    </div>
                    <CardDescription className="text-xs">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/admin/leads'}
              >
                <Users className="mr-2 h-4 w-4" />
                Ver todos os leads
                <ExternalLink className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open('/', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir formulário público
                <ExternalLink className="ml-auto h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
              <CardDescription>
                Informações sobre o funcionamento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sistema Online</span>
                <Badge variant="default" className="bg-green-500">
                  Ativo
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Última Atualização</span>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Versão</span>
                <Badge variant="secondary">v1.0</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}


