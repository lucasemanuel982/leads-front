import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funções utilitárias originais do projeto
export function formatPhone(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Se tem 11 dígitos (celular), formata como (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Se tem 10 dígitos (fixo), formata como (XX) XXXX-XXXX
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  // Se não tem o tamanho esperado, retorna o número original
  return phone;
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getTrackingParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utmSource: urlParams.get('utm_source') || '',
    utmMedium: urlParams.get('utm_medium') || '',
    utmCampaign: urlParams.get('utm_campaign') || '',
    utmTerm: urlParams.get('utm_term') || '',
    utmContent: urlParams.get('utm_content') || '',
    gclid: urlParams.get('gclid') || '',
    fbclid: urlParams.get('fbclid') || '',
  };
}