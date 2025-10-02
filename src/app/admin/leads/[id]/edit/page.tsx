'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { leadsApi } from '@/lib/api';
import { leadFormSchema, LeadFormData } from '@/lib/validations';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message?: string;
  isActive: boolean;
}

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const isActiveValue = watch('isActive');

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getById(id);
      const leadData = response.data.data;
      setLead(leadData);
      
      // Preenche o formulário com os dados do lead
      reset({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        position: leadData.position,
        birthDate: leadData.birthDate,
        message: leadData.message || '',
        isActive: leadData.isActive,
      });
    } catch (error) {
      console.error('Erro ao carregar lead:', error);
      alert('Lead não encontrado');
      router.push('/admin/leads');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await leadsApi.update(id, data);
      
      // Redireciona para a página de detalhes do lead
      router.push(`/admin/leads/${id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar lead. Tente novamente.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/leads/${id}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router.push(`/admin/leads/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Voltar para detalhes do lead"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Editar Lead</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <FiX />
              <span>Cancelar</span>
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-white`}
            >
              <FiSave />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8"
        >
          {submitError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              ✕ {submitError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nome completo"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(00) 00000-0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Cargo */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo *
                </label>
                <input
                  id="position"
                  type="text"
                  {...register('position')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Cargo atual"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="sr-only"
                    />
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isActiveValue ? 'bg-green-600' : 'bg-gray-300'
                    }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActiveValue ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {isActiveValue ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isActiveValue 
                    ? 'Clique no toggle para alterar o status do lead' 
                    : 'Lead inativo pode ser excluído permanentemente na página de detalhes'
                  }
                </p>
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem (opcional)
              </label>
              <textarea
                id="message"
                {...register('message')}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mensagem adicional..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              * Campos obrigatórios
            </p>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
