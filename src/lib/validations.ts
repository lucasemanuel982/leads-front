import { z } from 'zod';

/**
 * Schema de validação para o formulário de Lead
 * Usando Zod para validação no frontend
 */
export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(100, 'O nome não pode exceder 100 caracteres'),
  
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase(),
  
  phone: z
    .string()
    .min(10, 'O telefone deve ter pelo menos 10 caracteres')
    .max(20, 'O telefone não pode exceder 20 caracteres'),
  
  position: z
    .string()
    .min(2, 'O cargo deve ter pelo menos 2 caracteres')
    .max(100, 'O cargo não pode exceder 100 caracteres'),
  
  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return birthDate < today && age >= 18;
    }, 'É necessário ter 18 anos ou mais'),
  
  message: z
    .string()
    .max(1000, 'A mensagem não pode exceder 1000 caracteres')
    .optional(),
  
  isActive: z
    .boolean()
    .optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

/**
 * Schema de validação para login
 */
export const loginFormSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * Schema de validação para criar usuário
 */
export const createUserSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  role: z.enum(['admin', 'user']).default('admin'),
});

export type CreateUserData = z.infer<typeof createUserSchema>;


