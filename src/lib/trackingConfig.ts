// Configurações de Tracking
// Substitua pelos IDs reais das suas contas

export const trackingConfig = {
  // Google Tag Manager ID
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX',
  
  // Google Analytics 4 ID
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID || 'G-XXXXXXXXXX',
  
  // Meta Pixel ID
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || 'XXXXXXXXXXXXXXX',
  
  // Google Ads ID
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-XXXXXXXXX',
  
  // Configurações adicionais
  debug: process.env.NEXT_PUBLIC_TRACKING_DEBUG === 'true',
  defaultConversionValue: parseInt(process.env.NEXT_PUBLIC_CONVERSION_VALUE || '1'),
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'BRL',
  
  // Configurações de Enhanced Conversions
  enhancedConversions: {
    enabled: true,
    hashAlgorithm: 'sha256', // ou 'sha1' dependendo da configuração
    includeUserData: true,
  },
  
  // Configurações de eventos customizados
  customEvents: {
    formStart: 'form_start',
    formComplete: 'form_complete',
    formError: 'form_error',
    leadGenerated: 'generate_lead',
    pageView: 'page_view',
  },
  
  // Configurações de dados customizados
  customParameters: {
    siteVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    formType: 'lead_capture',
    leadSource: 'website',
  },
};

export default trackingConfig;
