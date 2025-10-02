// Serviço centralizado de tracking para GTM, GA4, Meta e Google Ads

import trackingConfig from './trackingConfig';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Tipos para os eventos de tracking
export interface TrackingEvent {
  event: string;
  parameters?: Record<string, any>;
}

export interface LeadTrackingData {
  email: string;
  phone: string;
  name: string;
  position: string;
  birthDate: string;
  message?: string;
  value?: number;
  currency?: string;
}

export interface PageViewData {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  content_group1?: string;
  content_group2?: string;
}

class TrackingService {
  private gtmId: string;
  private ga4Id: string;
  private metaPixelId: string;
  private googleAdsId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.gtmId = trackingConfig.gtmId;
    this.ga4Id = trackingConfig.ga4Id;
    this.metaPixelId = trackingConfig.metaPixelId;
    this.googleAdsId = trackingConfig.googleAdsId;
  }

  // Inicializa o Google Tag Manager
  initializeGTM() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // Carrega o script do GTM
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.gtmId}`;
    document.head.appendChild(script);

    // Inicializa o dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Configura o GA4
    window.gtag('js', new Date());
    window.gtag('config', this.ga4Id, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    // Inicializa o Meta Pixel
    this.initializeMetaPixel();

    this.isInitialized = true;
    console.log('GTM inicializado com sucesso');
  }

  // Inicializa o Meta Pixel
  private initializeMetaPixel() {
    if (typeof window === 'undefined') return;

    // Carrega o script do Meta Pixel
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.metaPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }

  // Envia evento de page view para GA4
  trackPageView(data?: PageViewData) {
    if (typeof window === 'undefined' || !window.gtag) return;

    const pageData = {
      page_title: data?.page_title || document.title,
      page_location: data?.page_location || window.location.href,
      page_path: data?.page_path || window.location.pathname,
      content_group1: data?.content_group1 || 'Lead Generation',
      content_group2: data?.content_group2 || 'Website',
      // Dados extras para diferencial
      timestamp: Date.now(),
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...data,
    };

    window.gtag('event', 'page_view', pageData);
    console.log('GA4 Page View enviado:', pageData);
  }

  // Envia evento de lead para GA4
  trackLeadGeneration(leadData: LeadTrackingData) {
    if (typeof window === 'undefined' || !window.gtag) return;

    const eventData = {
      event_category: 'Lead Generation',
      event_label: 'Form Submission',
      value: leadData.value || 1,
      currency: leadData.currency || 'BRL',
      lead_name: leadData.name,
      lead_position: leadData.position,
      lead_email: leadData.email,
      lead_phone: leadData.phone,
      lead_age: this.calculateAge(leadData.birthDate),
      // Dados extras para diferencial
      timestamp: Date.now(),
      form_id: 'lead-form',
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      custom_parameters: {
        form_type: 'lead_capture',
        submission_time: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        lead_source: 'website',
        lead_medium: 'form',
        lead_campaign: 'organic',
      },
    };

    window.gtag('event', 'generate_lead', eventData);
    console.log('GA4 Lead Generation enviado:', eventData);
  }

  // Envia evento de page view para Meta
  trackMetaPageView() {
    if (typeof window === 'undefined' || !window.fbq) return;

    window.fbq('track', 'PageView', {
      content_name: document.title,
      content_category: 'Lead Generation',
      content_type: 'website',
      // Dados extras para diferencial
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: document.referrer || 'direct',
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
    });

    console.log('Meta PageView enviado');
  }

  // Envia evento de lead para Meta
  trackMetaLead(leadData: LeadTrackingData) {
    if (typeof window === 'undefined' || !window.fbq) return;

    const eventData = {
      content_name: 'Lead Form Submission',
      content_category: 'Lead Generation',
      content_type: 'form',
      value: leadData.value || 1,
      currency: leadData.currency || 'BRL',
      lead_name: leadData.name,
      lead_position: leadData.position,
      lead_email: leadData.email,
      lead_phone: leadData.phone,
      // Dados extras para diferencial
      timestamp: Date.now(),
      form_id: 'lead-form',
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || 'direct',
      custom_data: {
        form_type: 'lead_capture',
        submission_time: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        lead_age: this.calculateAge(leadData.birthDate),
      },
    };

    window.fbq('track', 'Lead', eventData);
    console.log('Meta Lead enviado:', eventData);
  }

  // Push específico para Google Ads Enhanced Conversions via dataLayer
  trackGoogleAdsDataLayer(leadData: LeadTrackingData) {
    if (typeof window === 'undefined' || !window.dataLayer) return;

    const enhancedData = {
      event: 'generate_lead',
      email: leadData.email,
      phone: leadData.phone,
      // Dados extras para diferencial
      timestamp: Date.now(),
      form_id: 'lead-form',
      lead_name: leadData.name,
      lead_position: leadData.position,
      lead_age: this.calculateAge(leadData.birthDate),
      value: leadData.value || 1,
      currency: leadData.currency || 'BRL',
      // Dados de contexto
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      // Dados para Enhanced Conversions
      hashed_email: this.hashEmail(leadData.email),
      hashed_phone: this.hashPhone(leadData.phone),
      first_name: leadData.name.split(' ')[0],
      last_name: leadData.name.split(' ').slice(1).join(' '),
    };

    window.dataLayer.push(enhancedData);
    console.log('Google Ads Enhanced Conversions (dataLayer) enviado:', enhancedData);
  }

  // Envia evento de conversão para Google Ads com Enhanced Conversions
  trackGoogleAdsConversion(leadData: LeadTrackingData) {
    if (typeof window === 'undefined' || !window.gtag) return;

    // Hash dos dados para Enhanced Conversions
    const hashedEmail = this.hashEmail(leadData.email);
    const hashedPhone = this.hashPhone(leadData.phone);

    const conversionData = {
      send_to: `${this.googleAdsId}/lead_conversion`,
      value: leadData.value || 1,
      currency: leadData.currency || 'BRL',
      transaction_id: this.generateTransactionId(),
      user_data: {
        email_address: hashedEmail,
        phone_number: hashedPhone,
        address: {
          first_name: leadData.name.split(' ')[0],
          last_name: leadData.name.split(' ').slice(1).join(' '),
        },
      },
      custom_parameters: {
        lead_name: leadData.name,
        lead_position: leadData.position,
        lead_age: this.calculateAge(leadData.birthDate),
        form_type: 'lead_capture',
        submission_time: new Date().toISOString(),
      },
    };

    window.gtag('event', 'conversion', conversionData);
    console.log('Google Ads Conversion enviado:', conversionData);
  }

  // Método principal para trackear lead - envia para todas as plataformas
  trackLead(leadData: LeadTrackingData) {
    // Push específico para Google Ads Enhanced Conversions via dataLayer
    this.trackGoogleAdsDataLayer(leadData);
    
    // Track para GA4
    this.trackLeadGeneration(leadData);
    
    // Track para Meta Pixel
    this.trackMetaLead(leadData);
    
    // Track para Google Ads (método tradicional)
    this.trackGoogleAdsConversion(leadData);
  }

  // Método principal para trackear page view - envia para todas as plataformas
  trackPageViewAll(data?: PageViewData) {
    this.trackPageView(data);
    this.trackMetaPageView();
  }

  // Utilitários
  private calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private hashEmail(email: string): string {
    // Simulação de hash SHA-256 (em produção, use uma biblioteca real)
    return btoa(email.toLowerCase().trim());
  }

  private hashPhone(phone: string): string {
    // Remove caracteres não numéricos e aplica hash
    const cleanPhone = phone.replace(/\D/g, '');
    return btoa(cleanPhone);
  }

  private generateTransactionId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Método para debug - lista todos os eventos enviados
  getTrackingDebugInfo() {
    return {
      gtmId: this.gtmId,
      ga4Id: this.ga4Id,
      metaPixelId: this.metaPixelId,
      googleAdsId: this.googleAdsId,
      isInitialized: this.isInitialized,
      dataLayer: window.dataLayer || [],
    };
  }
}

// Instância singleton
export const trackingService = new TrackingService();

// Hook para usar o tracking em componentes React
export const useTracking = () => {
  return {
    trackLead: (leadData: LeadTrackingData) => trackingService.trackLead(leadData),
    trackPageView: (data?: PageViewData) => trackingService.trackPageViewAll(data),
    initializeTracking: () => trackingService.initializeGTM(),
    getDebugInfo: () => trackingService.getTrackingDebugInfo(),
  };
};

export default trackingService;
