'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { leadsApi } from '@/lib/api';
import { formatDateTime, formatPhone } from '@/lib/utils';
import { exportToCSV, exportToExcel, ExportLead } from '@/lib/export';
import { FiSearch, FiEye, FiTrash2, FiEdit, FiPlus, FiDownload } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  createdAt: string;
  isActive: boolean;
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeads();
  }, [page, search]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getAll({
        page,
        limit: 10,
        search: search || undefined,
      });

      setLeads(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on new search
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este lead?')) return;

    try {
      await leadsApi.deactivate(id);
      fetchLeads();
    } catch (error) {
      console.error('Erro ao desativar lead:', error);
      alert('Erro ao desativar lead');
    }
  };

  const viewLead = (id: string) => {
    router.push(`/admin/leads/${id}`);
  };

  const editLead = (id: string) => {
    router.push(`/admin/leads/${id}/edit`);
  };

  const createLead = () => {
    router.push('/admin/leads/new');
  };

  const handleExportCSV = async () => {
    try {
      // Busca todos os leads para exportação
      const response = await leadsApi.getAll({ 
        page: 1, 
        limit: 1000, // Busca até 1000 leads
        search: search || undefined 
      });
      
      const leadsData = response.data.data.map((lead: any) => ({
        _id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        position: lead.position,
        birthDate: lead.birthDate,
        message: lead.message,
        isActive: lead.isActive,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        utmSource: lead.tracking?.utmSource,
        utmMedium: lead.tracking?.utmMedium,
        utmCampaign: lead.tracking?.utmCampaign,
        utmTerm: lead.tracking?.utmTerm,
        utmContent: lead.tracking?.utmContent,
        gclid: lead.tracking?.gclid,
        fbclid: lead.tracking?.fbclid,
        ipAddress: lead.submissionInfo?.ipAddress,
        userAgent: lead.submissionInfo?.userAgent,
        referrer: lead.submissionInfo?.referrer,
        submittedAt: lead.submissionInfo?.submittedAt
      }));

      const filename = `leads_${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(leadsData, filename);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleExportExcel = async () => {
    try {
      // Busca todos os leads para exportação
      const response = await leadsApi.getAll({ 
        page: 1, 
        limit: 1000, // Busca até 1000 leads
        search: search || undefined 
      });
      
      const leadsData = response.data.data.map((lead: any) => ({
        _id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        position: lead.position,
        birthDate: lead.birthDate,
        message: lead.message,
        isActive: lead.isActive,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        utmSource: lead.tracking?.utmSource,
        utmMedium: lead.tracking?.utmMedium,
        utmCampaign: lead.tracking?.utmCampaign,
        utmTerm: lead.tracking?.utmTerm,
        utmContent: lead.tracking?.utmContent,
        gclid: lead.tracking?.gclid,
        fbclid: lead.tracking?.fbclid,
        ipAddress: lead.submissionInfo?.ipAddress,
        userAgent: lead.submissionInfo?.userAgent,
        referrer: lead.submissionInfo?.referrer,
        submittedAt: lead.submissionInfo?.submittedAt
      }));

      const filename = `leads_${new Date().toISOString().split('T')[0]}.xlsx`;
      exportToExcel(leadsData, filename);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('Erro ao exportar dados');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gerenciar Leads</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex-1 sm:flex-none"
                title="Exportar CSV"
              >
                <FiDownload size={16} />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex-1 sm:flex-none"
                title="Exportar Excel"
              >
                <FiDownload size={16} />
                <span className="hidden sm:inline">Excel</span>
              </button>
            </div>
            <button
              onClick={createLead}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <FiPlus />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <FiSearch className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Nenhum lead encontrado</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Telefone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Cargo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead, index) => (
                    <motion.tr
                      key={lead._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 w-1/5">
                        <div className="text-sm font-medium text-gray-900 truncate" title={lead.name}>
                          {lead.name}
                        </div>
                      </td>
                      <td className="px-4 py-4 w-1/5">
                        <div className="text-sm text-gray-500 truncate" title={lead.email}>
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-4 py-4 w-1/6">
                        <div className="text-sm text-gray-500">{formatPhone(lead.phone)}</div>
                      </td>
                      <td className="px-4 py-4 w-1/6">
                        <div className="text-sm text-gray-500 truncate" title={lead.position}>
                          {lead.position}
                        </div>
                      </td>
                      <td className="px-4 py-4 w-1/6">
                        <div className="text-sm text-gray-500">{formatDateTime(lead.createdAt)}</div>
                      </td>
                      <td className="px-4 py-4 w-20">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lead.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {lead.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-4 w-24">
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => viewLead(lead._id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Ver detalhes"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => editLead(lead._id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            title="Editar"
                          >
                            <FiEdit size={16} />
                          </button>
                          {lead.isActive && (
                            <button
                              onClick={() => handleDeactivate(lead._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Desativar"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {leads.map((lead, index) => (
                <motion.div
                  key={lead._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {lead.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Telefone:</span>
                      <span className="text-sm text-gray-900">{formatPhone(lead.phone)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Cargo:</span>
                      <span className="text-sm text-gray-900">{lead.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Data:</span>
                      <span className="text-sm text-gray-900">{formatDateTime(lead.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => viewLead(lead._id)}
                      className="px-3 py-1 text-blue-600 hover:text-blue-900 text-sm font-medium"
                      title="Ver detalhes"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => editLead(lead._id)}
                      className="px-3 py-1 text-green-600 hover:text-green-900 text-sm font-medium"
                      title="Editar"
                    >
                      Editar
                    </button>
                    {lead.isActive && (
                      <button
                        onClick={() => handleDeactivate(lead._id)}
                        className="px-3 py-1 text-red-600 hover:text-red-900 text-sm font-medium"
                        title="Desativar"
                      >
                        Desativar
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0 sm:space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 w-full sm:w-auto"
            >
              Anterior
            </button>
            <span className="px-4 py-2 bg-white rounded-lg shadow text-center w-full sm:w-auto">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 w-full sm:w-auto"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


