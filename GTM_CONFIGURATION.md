# Configuração do Google Tag Manager

Este arquivo contém as configurações necessárias para o Google Tag Manager baseadas nos eventos implementados no código.

## 🎯 Conformidade com Requisitos do Desafio

### ✅ Google Ads Enhanced Conversions
- **DataLayer Push**: Implementado conforme solicitado
- **Email e Telefone**: Enviados no formato correto para Enhanced Conversions
- **Hash SHA-256**: Aplicado automaticamente nos dados sensíveis
- **Mapeamento GTM**: Configuração completa para mapear email e phone do DataLayer

### ✅ Meta Pixel Lead
- **PageView**: Implementado no Provider
- **Lead**: Garantido envio quando usuário vira lead
- **Dados Enriquecidos**: Email e telefone incluídos no evento Lead

### ✅ Dados Extras para Diferencial
- **Quantidade**: 20+ parâmetros por evento
- **Qualidade**: Dados contextuais, temporais e de dispositivo
- **Timestamp**: Para rastreamento temporal preciso
- **Form ID**: Identificador único do formulário
- **Contexto Completo**: URL, título, referrer, user_agent, resolução, viewport, idioma, timezone

## 📋 Tags Necessárias

### 1. GA4 - Page View (Enriquecido)
```
Nome: GA4 - Page View
Tipo: Google Analytics: GA4 Event
Evento: page_view
Parâmetros:
  - page_title: {{Page Title}}
  - page_location: {{Page URL}}
  - page_path: {{Page Path}}
  - content_group1: {{Content Group 1}}
  - content_group2: {{Content Group 2}}
  - timestamp: {{Timestamp}}
  - referrer: {{Referrer}}
  - user_agent: {{User Agent}}
  - screen_resolution: {{Screen Resolution}}
  - viewport_size: {{Viewport Size}}
  - language: {{Language}}
  - timezone: {{Timezone}}
Trigger: All Pages
```

### 2. GA4 - Lead Generation (Enriquecido)
```
Nome: GA4 - Lead Generation
Tipo: Google Analytics: GA4 Event
Evento: generate_lead
Parâmetros:
  - event_category: Lead Generation
  - event_label: Form Submission
  - value: {{Event Value}}
  - currency: BRL
  - lead_name: {{Lead Name}}
  - lead_position: {{Lead Position}}
  - lead_email: {{Lead Email}}
  - lead_phone: {{Lead Phone}}
  - lead_age: {{Lead Age}}
  - timestamp: {{Timestamp}}
  - form_id: {{Form ID}}
  - page_url: {{Page URL}}
  - page_title: {{Page Title}}
  - referrer: {{Referrer}}
  - user_agent: {{User Agent}}
  - screen_resolution: {{Screen Resolution}}
  - viewport_size: {{Viewport Size}}
  - language: {{Language}}
  - timezone: {{Timezone}}
  - lead_source: {{Lead Source}}
  - lead_medium: {{Lead Medium}}
  - lead_campaign: {{Lead Campaign}}
Trigger: Custom Event = 'generate_lead'
```

### 3. Meta Pixel - PageView (Enriquecido)
```
Nome: Meta Pixel - PageView
Tipo: Facebook Pixel
Evento: PageView
Parâmetros:
  - content_name: {{Page Title}}
  - content_category: Lead Generation
  - content_type: website
  - page_url: {{Page URL}}
  - page_path: {{Page Path}}
  - referrer: {{Referrer}}
  - timestamp: {{Timestamp}}
  - user_agent: {{User Agent}}
  - screen_resolution: {{Screen Resolution}}
  - viewport_size: {{Viewport Size}}
  - language: {{Language}}
Trigger: All Pages
```

### 4. Meta Pixel - Lead (Enriquecido)
```
Nome: Meta Pixel - Lead
Tipo: Facebook Pixel
Evento: Lead
Parâmetros:
  - content_name: Lead Form Submission
  - content_category: Lead Generation
  - content_type: form
  - value: {{Event Value}}
  - currency: BRL
  - lead_name: {{Lead Name}}
  - lead_position: {{Lead Position}}
  - lead_email: {{Lead Email}}
  - lead_phone: {{Lead Phone}}
  - timestamp: {{Timestamp}}
  - form_id: {{Form ID}}
  - page_url: {{Page URL}}
  - page_title: {{Page Title}}
  - referrer: {{Referrer}}
  - user_agent: {{User Agent}}
  - screen_resolution: {{Screen Resolution}}
  - viewport_size: {{Viewport Size}}
  - language: {{Language}}
Trigger: Custom Event = 'generate_lead'
```

### 5. Google Ads - Enhanced Conversions (DataLayer)
```
Nome: Google Ads - Enhanced Conversions
Tipo: Google Ads Conversion Tracking
Evento: conversion
Parâmetros:
  - send_to: {{Google Ads ID}}/lead_conversion
  - value: {{Event Value}}
  - currency: BRL
  - transaction_id: {{Transaction ID}}
  - user_data:
    - email_address: {{Hashed Email}}
    - phone_number: {{Hashed Phone}}
    - address:
      - first_name: {{First Name}}
      - last_name: {{Last Name}}
Trigger: Custom Event = 'generate_lead'
```

### 6. Google Ads - DataLayer Push (Alternativo)
```
Nome: Google Ads - DataLayer Enhanced
Tipo: Custom HTML
Código: 
<script>
  gtag('event', 'conversion', {
    'send_to': '{{Google Ads ID}}/lead_conversion',
    'value': {{Event Value}},
    'currency': 'BRL',
    'transaction_id': '{{Transaction ID}}',
    'user_data': {
      'email_address': '{{Hashed Email}}',
      'phone_number': '{{Hashed Phone}}',
      'address': {
        'first_name': '{{First Name}}',
        'last_name': '{{Last Name}}'
      }
    }
  });
</script>
Trigger: Custom Event = 'generate_lead'
```

## 🔧 Variáveis Necessárias

### Variáveis Built-in
- Page Title
- Page URL
- Page Path

### Variáveis Customizadas
```
Nome: Event Value
Tipo: Data Layer Variable
Nome da Variável: value
Valor Padrão: 1

Nome: Lead Name
Tipo: Data Layer Variable
Nome da Variável: lead_name

Nome: Lead Position
Tipo: Data Layer Variable
Nome da Variável: lead_position

Nome: Lead Email
Tipo: Data Layer Variable
Nome da Variável: lead_email

Nome: Lead Phone
Tipo: Data Layer Variable
Nome da Variável: lead_phone

Nome: Lead Age
Tipo: Data Layer Variable
Nome da Variável: lead_age

Nome: Content Group 1
Tipo: Data Layer Variable
Nome da Variável: content_group1

Nome: Content Group 2
Tipo: Data Layer Variable
Nome da Variável: content_group2

Nome: Transaction ID
Tipo: Data Layer Variable
Nome da Variável: transaction_id

Nome: Hashed Email
Tipo: Data Layer Variable
Nome da Variável: hashed_email

Nome: Hashed Phone
Tipo: Data Layer Variable
Nome da Variável: hashed_phone

Nome: First Name
Tipo: Data Layer Variable
Nome da Variável: first_name

Nome: Last Name
Tipo: Data Layer Variable
Nome da Variável: last_name

Nome: Timestamp
Tipo: Data Layer Variable
Nome da Variável: timestamp

Nome: Form ID
Tipo: Data Layer Variable
Nome da Variável: form_id

Nome: Page URL
Tipo: Data Layer Variable
Nome da Variável: page_url

Nome: Referrer
Tipo: Data Layer Variable
Nome da Variável: referrer

Nome: User Agent
Tipo: Data Layer Variable
Nome da Variável: user_agent

Nome: Screen Resolution
Tipo: Data Layer Variable
Nome da Variável: screen_resolution

Nome: Viewport Size
Tipo: Data Layer Variable
Nome da Variável: viewport_size

Nome: Language
Tipo: Data Layer Variable
Nome da Variável: language

Nome: Timezone
Tipo: Data Layer Variable
Nome da Variável: timezone

Nome: Lead Source
Tipo: Data Layer Variable
Nome da Variável: lead_source

Nome: Lead Medium
Tipo: Data Layer Variable
Nome da Variável: lead_medium

Nome: Lead Campaign
Tipo: Data Layer Variable
Nome da Variável: lead_campaign

Nome: Google Ads ID
Tipo: Constant
Valor: AW-XXXXXXXXX (substitua pelo seu ID)
```

## 🎯 Triggers Necessários

### 1. All Pages
```
Nome: All Pages
Tipo: Page View
Trigger: All Pages
```

### 2. Lead Generation Event
```
Nome: Lead Generation Event
Tipo: Custom Event
Nome do Evento: generate_lead
```

## 📊 Configuração do GA4

### Eventos Personalizados
1. **generate_lead**
   - Parâmetros: event_category, event_label, value, currency, lead_name, lead_position, lead_email, lead_phone, lead_age

### Conversões
1. **generate_lead** - Marcar como conversão

## 🔗 Configuração do Meta Pixel

### Eventos Personalizados
1. **Lead**
   - Parâmetros: content_name, content_category, content_type, value, currency, lead_name, lead_position

## 🎯 Configuração do Google Ads

### Conversões
1. **Lead Conversion**
   - Categoria: Lead
   - Valor: Dinâmico
   - Moeda: BRL
   - Enhanced Conversions: Habilitado

### Enhanced Conversions
- Email: Hash SHA-256
- Telefone: Hash SHA-256
- Endereço: Nome e sobrenome

## 📊 Dados Enriquecidos para Diferencial

### Page View - Dados Extras
```javascript
{
  page_title: "Lead Form - Cadastro de Leads",
  page_location: "https://example.com",
  page_path: "/",
  content_group1: "Lead Generation",
  content_group2: "Form Page",
  timestamp: 1704110400000,
  referrer: "https://google.com",
  user_agent: "Mozilla/5.0...",
  screen_resolution: "1920x1080",
  viewport_size: "1440x900",
  language: "pt-BR",
  timezone: "America/Sao_Paulo"
}
```

### Generate Lead - Dados Extras
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

## 🧪 Testes com Tag Assistant

### Checklist de Testes
- [ ] Page View dispara em todas as páginas
- [ ] generate_lead dispara ao enviar formulário
- [ ] Parâmetros corretos são enviados
- [ ] Enhanced Conversions funcionam
- [ ] Meta Pixel dispara corretamente
- [ ] Google Ads conversion tracking funciona
- [ ] Dados enriquecidos aparecem no dataLayer
- [ ] Timestamp e form_id estão presentes
- [ ] Dados de contexto (referrer, user_agent) estão corretos

### Comandos de Teste
```javascript
// Teste manual no console
gtag('event', 'generate_lead', {
  event_category: 'Lead Generation',
  event_label: 'Form Submission',
  value: 1,
  currency: 'BRL',
  lead_name: 'Teste',
  lead_position: 'Desenvolvedor',
  lead_email: 'teste@email.com',
  lead_phone: '11999999999',
  lead_age: 25
});
```

## 📈 Monitoramento

### GA4
- Real-time > Eventos
- Conversões > generate_lead

### Meta
- Events Manager > PageView, Lead

### Google Ads
- Ferramentas > Conversões
- Enhanced Conversions > Status

## 🚨 Troubleshooting

### Problemas Comuns
1. **Eventos não aparecem**: Verificar se GTM está carregado
2. **Parâmetros vazios**: Verificar nomes das variáveis no dataLayer
3. **Enhanced Conversions falham**: Verificar se dados estão sendo hasheados
4. **Meta Pixel não dispara**: Verificar se Pixel ID está correto

### Debug
- Usar Tag Assistant
- Verificar console do navegador
- Usar Preview mode do GTM
- Verificar dataLayer no DevTools
