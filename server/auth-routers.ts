/**
 * Routers de autenticação usando Supabase Auth
 */

import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import * as SupabaseAuth from './supabase-auth';

export const authRouter = router({
  // Login com email e senha
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input }) => {
      const result = await SupabaseAuth.signInWithEmail(input.email, input.password);
      return result;
    }),

  // Criar nova conta
  signup: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await SupabaseAuth.signUp(input.email, input.password, input.name);
      return result;
    }),

  // Logout
  logout: publicProcedure
    .mutation(async () => {
      await SupabaseAuth.signOut();
      return { success: true };
    }),

  // Obter usuário atual
  me: publicProcedure
    .query(async () => {
      const user = await SupabaseAuth.getCurrentUser();
      return user;
    }),

  // Verificar se é admin
  isAdmin: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const isAdmin = await SupabaseAuth.isAdmin(input);
      return isAdmin;
    }),
});
