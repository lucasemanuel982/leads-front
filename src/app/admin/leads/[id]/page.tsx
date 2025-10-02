'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { leadsApi } from '@/lib/api';
import { formatDateTime, formatDate, formatPhone } from '@/lib/utils';
import { FiArrowLeft, FiTrash2, FiEdit } from 'react-icons/fi';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message?: string;
  tracking: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    gclid?: string;
    fbclid?: string;
  };
  submissionInfo: {
    ipAddress: string;
    userAgent?: string;
    referrer?: string;
    submittedAt: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await leadsApi.getById(id);
      setLead(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar lead:', error);
      alert('Lead não encontrado');
      router.push('/admin/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Tem certeza que deseja desativar este lead?')) return;

    try {
      await leadsApi.deactivate(id);
      router.push('/admin/leads');
    } catch (error) {
      console.error('Erro ao desativar lead:', error);
      alert('Erro ao desativar lead');
    }
  };

  const handleDeletePermanent = async () => {
    if (!confirm('ATENÇÃO: Esta ação é irreversível!\n\nTem certeza que deseja excluir permanentemente este lead?')) return;

    try {
      await leadsApi.delete(id);
      router.push('/admin/leads');
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      alert('Erro ao excluir lead');
    }
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

  const hasTracking = Object.values(lead.tracking).some(v => v);

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router.push('/admin/leads')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Voltar para lista de leads"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Detalhes do Lead</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push(`/admin/leads/${id}/edit`)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FiEdit />
              <span>Editar Lead</span>
            </button>
            {lead.isActive ? (
              <button
                onClick={handleDeactivate}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FiTrash2 />
                <span>Desativar Lead</span>
              </button>
            ) : (
              <button
                onClick={handleDeletePermanent}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition"
              >
                <FiTrash2 />
                <span>Excluir Permanentemente</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informações Pessoais</h2>
            <div className="space-y-3">
              <InfoRow label="Nome" value={lead.name} />
              <InfoRow label="Email" value={lead.email} />
              <InfoRow label="Telefone" value={formatPhone(lead.phone)} />
              <InfoRow label="Cargo" value={lead.position} />
              <InfoRow label="Data de Nascimento" value={formatDate(lead.birthDate)} />
              {lead.message && <InfoRow label="Mensagem" value={lead.message} />}
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      lead.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {lead.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                }
              />
            </div>
          </motion.div>

          {/* Informações de Submissão */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informações de Submissão</h2>
            <div className="space-y-3">
              <InfoRow label="IP" value={lead.submissionInfo.ipAddress} />
              <InfoRow label="User Agent" value={lead.submissionInfo.userAgent || 'N/A'} />
              <InfoRow label="Referrer" value={lead.submissionInfo.referrer || 'Direto'} />
              <InfoRow label="Data de Submissão" value={formatDateTime(lead.submissionInfo.submittedAt)} />
              <InfoRow label="Criado em" value={formatDateTime(lead.createdAt)} />
              <InfoRow label="Atualizado em" value={formatDateTime(lead.updatedAt)} />
            </div>
          </motion.div>

          {/* Tracking UTM */}
          {hasTracking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tracking de Campanhas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lead.tracking.utmSource && <InfoRow label="UTM Source" value={lead.tracking.utmSource} />}
                {lead.tracking.utmMedium && <InfoRow label="UTM Medium" value={lead.tracking.utmMedium} />}
                {lead.tracking.utmCampaign && <InfoRow label="UTM Campaign" value={lead.tracking.utmCampaign} />}
                {lead.tracking.utmTerm && <InfoRow label="UTM Term" value={lead.tracking.utmTerm} />}
                {lead.tracking.utmContent && <InfoRow label="UTM Content" value={lead.tracking.utmContent} />}
                {lead.tracking.gclid && <InfoRow label="GCLID (Google)" value={lead.tracking.gclid} />}
                {lead.tracking.fbclid && <InfoRow label="FBCLID (Facebook)" value={lead.tracking.fbclid} />}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}

