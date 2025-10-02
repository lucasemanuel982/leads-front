import * as XLSX from 'xlsx';

/**
 * Funções para exportação de dados
 */

export interface ExportLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  ipAddress: string;
  userAgent?: string;
  referrer?: string;
  submittedAt: string;
}

/**
 * Converte dados de leads para formato CSV
 */
export const exportToCSV = (leads: ExportLead[], filename: string = 'leads.csv') => {
  if (leads.length === 0) {
    alert('Nenhum lead para exportar');
    return;
  }

  // Cabeçalhos do CSV
  const headers = [
    'ID',
    'Nome',
    'Email',
    'Telefone',
    'Cargo',
    'Data de Nascimento',
    'Mensagem',
    'Status',
    'Data de Criação',
    'Data de Atualização',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'UTM Term',
    'UTM Content',
    'GCLID',
    'FBCLID',
    'IP',
    'User Agent',
    'Referrer',
    'Data de Submissão'
  ];

  // Converte dados para formato CSV
  const csvContent = [
    headers.join(','),
    ...leads.map(lead => [
      lead._id,
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.phone}"`,
      `"${lead.position}"`,
      lead.birthDate,
      `"${lead.message || ''}"`,
      lead.isActive ? 'Ativo' : 'Inativo',
      lead.createdAt,
      lead.updatedAt,
      `"${lead.utmSource || ''}"`,
      `"${lead.utmMedium || ''}"`,
      `"${lead.utmCampaign || ''}"`,
      `"${lead.utmTerm || ''}"`,
      `"${lead.utmContent || ''}"`,
      `"${lead.gclid || ''}"`,
      `"${lead.fbclid || ''}"`,
      `"${lead.ipAddress}"`,
      `"${lead.userAgent || ''}"`,
      `"${lead.referrer || ''}"`,
      lead.submittedAt
    ].join(','))
  ].join('\n');

  // Cria e baixa o arquivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Converte dados de leads para formato Excel
 */
export const exportToExcel = (leads: ExportLead[], filename: string = 'leads.xlsx') => {
  if (leads.length === 0) {
    alert('Nenhum lead para exportar');
    return;
  }

  // Prepara dados para Excel
  const excelData = leads.map(lead => ({
    'ID': lead._id,
    'Nome': lead.name,
    'Email': lead.email,
    'Telefone': lead.phone,
    'Cargo': lead.position,
    'Data de Nascimento': lead.birthDate,
    'Mensagem': lead.message || '',
    'Status': lead.isActive ? 'Ativo' : 'Inativo',
    'Data de Criação': lead.createdAt,
    'Data de Atualização': lead.updatedAt,
    'UTM Source': lead.utmSource || '',
    'UTM Medium': lead.utmMedium || '',
    'UTM Campaign': lead.utmCampaign || '',
    'UTM Term': lead.utmTerm || '',
    'UTM Content': lead.utmContent || '',
    'GCLID': lead.gclid || '',
    'FBCLID': lead.fbclid || '',
    'IP': lead.ipAddress,
    'User Agent': lead.userAgent || '',
    'Referrer': lead.referrer || '',
    'Data de Submissão': lead.submittedAt
  }));

  // Cria workbook e worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Ajusta largura das colunas
  const colWidths = [
    { wch: 25 }, // ID
    { wch: 20 }, // Nome
    { wch: 25 }, // Email
    { wch: 15 }, // Telefone
    { wch: 20 }, // Cargo
    { wch: 15 }, // Data de Nascimento
    { wch: 30 }, // Mensagem
    { wch: 10 }, // Status
    { wch: 20 }, // Data de Criação
    { wch: 20 }, // Data de Atualização
    { wch: 15 }, // UTM Source
    { wch: 15 }, // UTM Medium
    { wch: 20 }, // UTM Campaign
    { wch: 15 }, // UTM Term
    { wch: 15 }, // UTM Content
    { wch: 20 }, // GCLID
    { wch: 20 }, // FBCLID
    { wch: 15 }, // IP
    { wch: 30 }, // User Agent
    { wch: 20 }, // Referrer
    { wch: 20 }, // Data de Submissão
  ];
  worksheet['!cols'] = colWidths;

  // Adiciona worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

  // Baixa o arquivo
  XLSX.writeFile(workbook, filename);
};

/**
 * Formata data para exportação
 */
export const formatDateForExport = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
};
