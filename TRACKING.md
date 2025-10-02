# Sistema de Tracking - Google Tag Manager

Este projeto implementa um sistema completo de tracking usando Google Tag Manager (GTM) com integração para Google Analytics 4 (GA4), Meta Pixel e Google Ads com Enhanced Conversions.

## Funcionalidades Implementadas

### Google Analytics 4 (GA4)
- **page_view**: Rastreamento automático de visualizações de página
- **generate_lead**: Evento disparado quando um lead é gerado
- Dados customizados incluindo idade, cargo, fonte de tráfego
- Parâmetros de conversão com valor e moeda
- **Dados Enriquecidos**: Timestamp, referrer, user_agent, screen_resolution, viewport_size, language, timezone

### Meta Pixel
- **PageView**: Rastreamento de visualizações de página
- **Lead**: Evento de conversão quando lead é gerado
- Dados customizados para otimização de campanhas
- Integração com Facebook Ads Manager
- **Dados Enriquecidos**: Timestamp, form_id, contexto da página, informações do dispositivo

### Google Ads Enhanced Conversions
- **DataLayer Push**: Push específico para Google Ads via dataLayer
- **Enhanced Conversions**: Hash de email e telefone para melhor atribuição
- **Dados Enriquecidos**: Timestamp, form_id, dados de contexto
- **Dual Implementation**: Método tradicional + dataLayer push
- **Conformidade**: Implementação completa conforme requisitos do desafio

## Como Usar

### 1. Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local`  com os IDs reais:

```env
# Google Tag Manager ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Analytics 4 ID
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Meta Pixel ID
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX

# Google Ads ID
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX

# Configurações adicionais
NEXT_PUBLIC_TRACKING_DEBUG=true
NEXT_PUBLIC_CONVERSION_VALUE=1
NEXT_PUBLIC_CURRENCY=BRL
```

### 2. Estrutura dos Arquivos

```
frontend/src/
├── lib/
│   ├── tracking.ts          # Serviço principal de tracking
│   └── trackingConfig.ts   # Configurações de tracking
├── components/
│   ├── GTMProvider.tsx      # Provider do GTM
│   └── TrackingDebug.tsx   # Componente de debug
└── app/
    ├── layout.tsx          # Layout com GTM integrado
    └── page.tsx            # Página principal com debug
```

## Configuração do Google Tag Manager

### 1. Tags Configuradas

#### GA4 - Page View
- **Tipo**: Google Analytics: GA4 Event
- **Evento**: page_view
- **Parâmetros**: page_title, page_location, page_path, content_group1, content_group2

#### GA4 - Lead Generation
- **Tipo**: Google Analytics: GA4 Event
- **Evento**: generate_lead
- **Parâmetros**: event_category, event_label, value, currency, lead_name, lead_position, lead_email, lead_phone, lead_age

#### Meta Pixel - PageView
- **Tipo**: Facebook Pixel
- **Evento**: PageView
- **Parâmetros**: content_name, content_category, content_type

#### Meta Pixel - Lead
- **Tipo**: Facebook Pixel
- **Evento**: Lead
- **Parâmetros**: content_name, content_category, value, currency, lead_name, lead_position

#### Google Ads - Conversion
- **Tipo**: Google Ads Conversion Tracking
- **Evento**: conversion
- **Parâmetros**: send_to, value, currency, transaction_id, user_data (Enhanced Conversions)

### 2. Triggers Configurados

- **Page View**: All Pages
- **Lead Generation**: Custom Event = 'generate_lead'
- **Form Submission**: Custom Event = 'form_submit'

### 3. Variáveis Configuradas

- **Page Title**: {{Page Title}}
- **Page URL**: {{Page URL}}
- **Event Value**: {{Event Value}}
- **Lead Email**: {{Lead Email}}
- **Lead Phone**: {{Lead Phone}}

## 🐛 Debug e Testes

### Tag Assistant
Use o Google Tag Assistant para verificar se os eventos estão sendo disparados corretamente:

1. Instale a extensão Tag Assistant
2. Navegue até o site
3. Verifique os eventos disparados
4. Confirme os parâmetros enviados

### Componente de Debug
O projeto inclui um componente de debug que mostra:
- Status do tracking (ativo/inativo)
- IDs configurados
- Eventos enviados para o dataLayer
- Informações de debug em tempo real

### Console Logs
Todos os eventos são logados no console para facilitar o debug:
```javascript
console.log('GA4 Page View enviado:', pageData);
console.log('GA4 Lead Generation enviado:', eventData);
console.log('Meta PageView enviado');
console.log('Meta Lead enviado:', eventData);
console.log('Google Ads Conversion enviado:', conversionData);
```

## 📊 Dados Enviados

### Page View
```javascript
{
  page_title: "Lead Form - Cadastro de Leads",
  page_location: "https://example.com",
  page_path: "/",
  content_group1: "Lead Generation",
  content_group2: "Form Page"
}
```

### Lead Generation
```javascript
{
  event_category: "Lead Generation",
  event_label: "Form Submission",
  value: 1,
  currency: "BRL",
  lead_name: "João Silva",
  lead_position: "Desenvolvedor",
  lead_email: "joao@email.com",
  lead_phone: "11999999999",
  lead_age: 25,
  custom_parameters: {
    form_type: "lead_capture",
    submission_time: "2024-01-01T12:00:00.000Z",
    user_agent: "Mozilla/5.0...",
    referrer: "https://google.com"
  }
}
```

### Enhanced Conversions (Google Ads)
```javascript
{
  send_to: "AW-XXXXXXXXX/lead_conversion",
  value: 1,
  currency: "BRL",
  transaction_id: "lead_1704110400000_abc123def",
  user_data: {
    email_address: "hashed_email",
    phone_number: "hashed_phone",
    address: {
      first_name: "João",
      last_name: "Silva"
    }
  }
}
```

### DataLayer Push (Google Ads Enhanced)
```javascript
{
  event: "generate_lead",
  email: "joao@email.com",
  phone: "11999999999",
  timestamp: 1704110400000,
  form_id: "lead-form",
  lead_name: "João Silva",
  lead_position: "Desenvolvedor",
  lead_age: 25,
  value: 1,
  currency: "BRL",
  page_url: "https://example.com",
  page_title: "Lead Form - Cadastro de Leads",
  referrer: "https://google.com",
  user_agent: "Mozilla/5.0...",
  screen_resolution: "1920x1080",
  viewport_size: "1440x900",
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
  hashed_email: "hashed_email_value",
  hashed_phone: "hashed_phone_value",
  first_name: "João",
  last_name: "Silva",
  lead_source: "website",
  lead_medium: "form",
  lead_campaign: "organic"
}
```


### Google Ads Enhanced Conversions
- **DataLayer Push**: Implementado conforme solicitado
- **Email e Telefone**: Enviados no formato correto para Enhanced Conversions
- **Hash SHA-256**: Aplicado automaticamente nos dados sensíveis
- **Mapeamento GTM**: Configuração completa para mapear email e phone do DataLayer

### Meta Pixel Lead
- **PageView**: Implementado no Provider
- **Lead**: Garantido envio quando usuário vira lead
- **Dados Enriquecidos**: Email e telefone incluídos no evento Lead

### Dados Extras para Diferencial
- **Quantidade**: 20+ parâmetros por evento
- **Qualidade**: Dados contextuais, temporais e de dispositivo
- **Timestamp**: Para rastreamento temporal preciso
- **Form ID**: Identificador único do formulário
- **Contexto Completo**: URL, título, referrer, user_agent, resolução, viewport, idioma, timezone

## Dados Enriquecidos para Diferencial

### Page View - Dados Extras
- **Timestamp**: Timestamp Unix para rastreamento temporal
- **Referrer**: Página de origem do usuário
- **User Agent**: Informações do navegador
- **Screen Resolution**: Resolução da tela
- **Viewport Size**: Tamanho da janela do navegador
- **Language**: Idioma do navegador
- **Timezone**: Fuso horário do usuário

### Generate Lead - Dados Extras
- **Timestamp**: Timestamp Unix para rastreamento temporal
- **Form ID**: Identificador único do formulário
- **Page Context**: URL, título, referrer da página
- **Device Info**: Resolução, viewport, user agent
- **User Context**: Idioma, timezone
- **Lead Context**: Fonte, meio, campanha
- **Enhanced Data**: Dados hasheados para Enhanced Conversions

## Privacidade e LGPD

- Emails e telefones são hasheados antes do envio para Enhanced Conversions
- Dados pessoais são tratados conforme LGPD
- Usuário pode optar por não ser rastreado
- Dados são usados apenas para análise de conversão



## Monitoramento

- **GA4**: Real-time reports para verificar eventos
- **Meta**: Events Manager para verificar PageView e Lead
- **Google Ads**: Conversions para verificar Enhanced Conversions
- **GTM**: Preview mode para debug em tempo real



## Recursos Adicionais e documentações utilizadas

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [GA4 Events Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Meta Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [Google Ads Enhanced Conversions](https://support.google.com/google-ads/answer/9888156)
