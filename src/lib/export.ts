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
 * Sanitiza string para prevenir injection e problemas de segurança
 */
const sanitizeString = (str: string | undefined | null): string => {
  if (!str) return '';
  // Remove caracteres de controle e limita tamanho
  return String(str)
    .replace(/[\x00-\x1F\x7F]/g, '')
    .substring(0, 1000);
};

/**
 * Converte dados de leads para formato Excel
 * NOTA: Usa xlsx que tem vulnerabilidades conhecidas, mas apenas para GERAÇÃO de arquivos
 * (não para parsing de arquivos maliciosos). Dados são sanitizados antes da exportação.
 */
export const exportToExcel = (leads: ExportLead[], filename: string = 'leads.xlsx') => {
  if (leads.length === 0) {
    alert('Nenhum lead para exportar');
    return;
  }

  // Limita número de leads para prevenir DoS
  const MAX_LEADS = 10000;
  const leadsToExport = leads.slice(0, MAX_LEADS);

  // Prepara dados para Excel com sanitização
  const excelData = leadsToExport.map(lead => ({
    'ID': sanitizeString(lead._id),
    'Nome': sanitizeString(lead.name),
    'Email': sanitizeString(lead.email),
    'Telefone': sanitizeString(lead.phone),
    'Cargo': sanitizeString(lead.position),
    'Data de Nascimento': sanitizeString(lead.birthDate),
    'Mensagem': sanitizeString(lead.message),
    'Status': lead.isActive ? 'Ativo' : 'Inativo',
    'Data de Criação': sanitizeString(lead.createdAt),
    'Data de Atualização': sanitizeString(lead.updatedAt),
    'UTM Source': sanitizeString(lead.utmSource),
    'UTM Medium': sanitizeString(lead.utmMedium),
    'UTM Campaign': sanitizeString(lead.utmCampaign),
    'UTM Term': sanitizeString(lead.utmTerm),
    'UTM Content': sanitizeString(lead.utmContent),
    'GCLID': sanitizeString(lead.gclid),
    'FBCLID': sanitizeString(lead.fbclid),
    'IP': sanitizeString(lead.ipAddress),
    'User Agent': sanitizeString(lead.userAgent),
    'Referrer': sanitizeString(lead.referrer),
    'Data de Submissão': sanitizeString(lead.submittedAt)
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
