'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { leadFormSchema, LeadFormData } from '@/lib/validations';
import { leadsApi } from '@/lib/api';
import { getTrackingParams } from '@/lib/utils';
import { useTracking } from '@/lib/tracking';
import ToastContainer, { useToast } from './Toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Phone, Briefcase, Calendar, MessageSquare } from 'lucide-react';

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toasts, removeToast, success, error } = useToast();
  const { trackLead, trackPageView } = useTracking();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  // Track page view quando o componente monta
  useEffect(() => {
    trackPageView({
      page_title: 'Lead Form - Cadastro de Leads',
      page_location: window.location.href,
      page_path: window.location.pathname,
      content_group1: 'Lead Generation',
      content_group2: 'Form Page',
    });
  }, [trackPageView]);

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);

    try {
      // Validação adicional de idade
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        error('Idade Insuficiente', 'É necessário ter 18 anos ou mais para se cadastrar.');
        return;
      }

      // Adiciona tracking params
      const trackingParams = getTrackingParams();

      // Tenta obter o IP do usuário
      let userIP = '';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        userIP = ipData.ip || '';
      } catch (ipError) {
        console.log('Não foi possível obter IP:', ipError);
        userIP = ''; // Usa string vazia se não conseguir obter o IP
      }

      // Adiciona submissionInfo para o formulário público
      const submissionInfo = {
        ipAddress: userIP,
        userAgent: navigator.userAgent,
        referrer: document.referrer || '',
        submittedAt: new Date().toISOString(),
      };

      await leadsApi.create({
        ...data,
        tracking: trackingParams,
        submissionInfo: submissionInfo,
      });

      // Track lead generation em todas as plataformas
      trackLead({
        email: data.email,
        phone: data.phone,
        name: data.name,
        position: data.position,
        birthDate: data.birthDate,
        message: data.message,
        value: 1, // Valor padrão para conversão
        currency: 'BRL',
      });

      success('Sucesso!', 'Formulário enviado com sucesso! Entraremos em contato em breve.');
      setSubmitSuccess(true);
      reset();

      // Reseta mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao enviar formulário. Tente novamente.';
      
      // Verifica se é erro de validação específico
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        validationErrors.forEach((validationError: any) => {
          error('Erro de Validação', validationError.message);
        });
      } else {
        error('Erro', errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm max-w-2xl mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
            Cadastre-se e receba mais informações
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm sm:text-base">
            Preencha os dados abaixo para entrar em contato conosco
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome Completo *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  type="text"
                  {...register('name')}
                  className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Telefone *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                  placeholder="(00) 00000-0000"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Cargo */}
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium">
                Cargo *
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="position"
                  type="text"
                  {...register('position')}
                  className={`pl-10 ${errors.position ? 'border-destructive' : ''}`}
                  placeholder="Seu cargo atual"
                />
              </div>
              {errors.position && (
                <p className="text-sm text-destructive">{errors.position.message}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium">
                Data de Nascimento *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                  className={`pl-10 ${errors.birthDate ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.birthDate && (
                <p className="text-sm text-destructive">{errors.birthDate.message}</p>
              )}
            </div>

            {/* Mensagem */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Mensagem (opcional)
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <Textarea
                  id="message"
                  {...register('message')}
                  rows={4}
                  className={`pl-10 ${errors.message ? 'border-destructive' : ''}`}
                  placeholder="Deixe sua mensagem..."
                />
              </div>
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            {/* Botão de Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Cadastro'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            * Campos obrigatórios
          </p>
        </CardContent>
      </Card>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </motion.div>
  );
}


