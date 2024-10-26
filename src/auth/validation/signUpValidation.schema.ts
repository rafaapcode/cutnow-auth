import { z } from 'zod';
import { validateCEP, validateCnpj, validateCpf } from '../lib/utils';

export const signUpAdminSchema = z
  .object({
    nome: z
      .string({ message: 'O nome é obrigatório.' })
      .min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    nomeDaBarbearia: z
      .string({ message: 'O nome da barbearia é obrigatório.' })
      .min(3, 'O nome da barbearia deve ter no mínimo 3 caracteres.'),
    email: z
      .string({ message: 'O email é obrigatório' })
      .email({ message: 'Email inválido' })
      .regex(/^[a-zA-Z0-9._%+-]+(@gmail|@outlook|@yahoo)\.(com|org)$/, {
        message: 'Coloque um email válido.',
      }),
    cnpj: z
      .string({ message: 'O cnpj é obrigatório' })
      .min(14, 'O CNPJ deve ter no mínimo 14 caracteres')
      .refine(validateCnpj, { message: 'Forneça um CNPJ válido' }),
    senha: z
      .string({ message: 'A senha é obrigatória' })
      .min(8, 'A senha deve ter no mínimo 8 caracteres'),
    informacoes: z.object({
      cep: z
        .string({ message: 'O CEP é obrigatório.' })
        .min(8, 'O CEP deve ter no mínimo 8 caracteres')
        .max(8, 'O cep deve ter no máximo 8 caracteres')
        .refine(validateCEP, 'Coloque um CEP válido'),
      rua: z.string(),
      bairro: z.string(),
      cidade: z.string(),
      estado: z.string(),
      numero: z
        .number({ message: 'O número é obrigatório' })
        .min(1, 'Deve ter pelo meno 1 caractere'),
      horarioAbertura: z.string(),
      horarioFechamento: z.string(),
      fotosEstruturaBarbearia: z.string().array().optional(),
      fotoBanner: z.string().optional(),
      logo: z.string().optional(),
      status: z.string().optional(),
    }),
    servicos: z
      .object({
        nomeService: z.string(),
        tempoMedio: z.number(),
        preco: z.number(),
      })
      .array(),
  })
  .required();

export const signUpBarberSchema = z.object({
  nome: z
    .string({ message: 'O nome é obrigatório.' })
    .min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  email: z
    .string({ message: 'O email é obrigatório' })
    .email({ message: 'Email inválido' })
    .regex(/^[a-zA-Z0-9._%+-]+(@gmail|@outlook|@yahoo)\.(com|org)$/, {
      message: 'Coloque um email válido.',
    }),
  cpf: z
    .string({ message: 'O CPF é obrigatório' })
    .min(11, 'O CPF deve ter no mínimo 11 caracteres')
    .max(11, 'O CPF deve ter no máximo 11 caracteres')
    .refine(validateCpf, 'Coloque um CPF válido'),
  senha: z
    .string({ message: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),
  status: z.string().optional(),
  barbearia_id: z.string(),
  informacoes: z
    .object({
      portfolio: z
        .string()
        .url({ message: 'Deve ser urls' })
        .array()
        .optional(),
      banner: z.string().url({ message: 'Deve ser url' }).optional(),
      foto: z.string().url({ message: 'Deve ser url' }).optional(),
      descricao: z.string().url({ message: 'Deve ser url' }).optional(),
    })
    .optional(),
});
