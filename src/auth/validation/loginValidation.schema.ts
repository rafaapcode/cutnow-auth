import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string({ message: 'O email é obrigatório' })
    .email({ message: 'Email inválido' })
    .regex(/^[a-zA-Z0-9._%+-]+(@gmail|@outlook|@yahoo)\.(com|org)$/, {
      message: 'Coloque um email válido.',
    }),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),
});
