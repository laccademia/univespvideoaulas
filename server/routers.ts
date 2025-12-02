import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { z } from "zod";
import * as SupabaseAuth from "./supabase-auth";
import { getDb } from "./db";
import { disciplinas, videoaulas, ofertasDisciplinas, cursosDisciplinas, historicoImportacoes, users } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
// Imports para leitura pública (Supabase)
import {
  getAllCursos,
  getCursoById,
  getDisciplinasByCursoId,
  getAllDisciplinas,
  getDisciplinaByCodigo,
  getAllProfessores,
  getProfessorByNome,
  getAllDesignersInstrucionais,
  getDesignerInstrucionalByNome,
  getVideoaulasComDetalhes,
  getVideoaulaById,
  getDisciplinasComCurso,
  getEstatisticasGerais,
} from "./supabase-adapter";

// Imports para painel administrativo (Manus)
import {
  createVideoaula,
  updateVideoaula,
  deleteVideoaula,
  getOrCreateOfertaDisciplina,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  getProfessorById as getManusProf,
  createDisciplina,
  updateDisciplina,
  deleteDisciplina,
  getDisciplinaById as getManusDisciplina,
  createDesignerInstrucional,
  updateDesignerInstrucional,
  deleteDesignerInstrucional,
  getDesignerInstrucionalById as getManusDesigner,
  createCurso,
  updateCurso,
  deleteCurso,
  getCursoById as getManusCurso,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    // OAuth Manus (desenvolvimento)
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    // Login e Signup (Supabase Auth)
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
          const { email, password } = input;
          
          console.log('[LOGIN] Tentando login para:', email);
          
          // Tentar login com credenciais do banco Manus primeiro
          const db = await getDb();
          if (db) {
            console.log('[LOGIN] Buscando usuário no banco Manus...');
            const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
            
            console.log('[LOGIN] Usuário encontrado:', user ? 'SIM' : 'NÃO');
            console.log('[LOGIN] Tem passwordHash:', user?.passwordHash ? 'SIM' : 'NÃO');
            
            if (user && user.passwordHash) {
              // Verificar senha hash
              const crypto = await import('crypto');
              const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
              
              console.log('[LOGIN] Hash calculado:', passwordHash);
              console.log('[LOGIN] Hash armazenado:', user.passwordHash);
              console.log('[LOGIN] Hashes iguais:', passwordHash === user.passwordHash);
              
              if (passwordHash === user.passwordHash) {
                console.log('[LOGIN] Login bem-sucedido com credenciais do banco!');
                return {
                  user: {
                    id: user.openId,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                  },
                  session: null,
                };
              } else {
                console.log('[LOGIN] Senha incorreta!');
              }
            }
          }
          
          console.log('[LOGIN] Tentando Supabase Auth...');
          // Se não encontrou no banco ou senha incorreta, tentar Supabase Auth
          const result = await SupabaseAuth.signInWithEmail(email, password);
          return result;
        }),

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

    getUser: publicProcedure
      .query(async () => {
        const user = await SupabaseAuth.getCurrentUser();
        return user;
      }),
  }),

  // ============================================
  // CURSOS
  // ============================================
  cursos: router({
    list: publicProcedure.query(async () => {
      return await getAllCursos();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getCursoById(input.id);
      }),
    
    getDisciplinas: publicProcedure
      .input(z.object({ cursoId: z.number() }))
      .query(async ({ input }) => {
        return await getDisciplinasByCursoId(input.cursoId);
      }),
  }),

  // ============================================
  // DISCIPLINAS
  // ============================================
  disciplinas: router({
    list: publicProcedure.query(async () => {
      return await getAllDisciplinas();
    }),
    
    listComCurso: publicProcedure.query(async () => {
      return await getDisciplinasComCurso();
    }),
    
    getByCodigo: publicProcedure
      .input(z.object({ codigo: z.string() }))
      .query(async ({ input }) => {
        return await getDisciplinaByCodigo(input.codigo);
      }),
  }),

  // ============================================
  // PROFESSORES
  // ============================================
  professores: router({
    list: publicProcedure.query(async () => {
      return await getAllProfessores();
    }),
    
    getByNome: publicProcedure
      .input(z.object({ nome: z.string() }))
      .query(async ({ input }) => {
        return await getProfessorByNome(input.nome);
      }),
  }),

  // ============================================
  // DESIGNERS INSTRUCIONAIS
  // ============================================
  dis: router({
    list: publicProcedure.query(async () => {
      return await getAllDesignersInstrucionais();
    }),
    
    getByNome: publicProcedure
      .input(z.object({ nome: z.string() }))
      .query(async ({ input }) => {
        return await getDesignerInstrucionalByNome(input.nome);
      }),
  }),

  // ============================================
  // VIDEOAULAS
  // ============================================
  videoaulas: router({
    list: publicProcedure
      .input(z.object({
        cursoId: z.number().optional(),
        disciplinaCodigo: z.string().optional(),
        ano: z.number().optional(),
        bimestre: z.number().optional(),
        professorNome: z.string().optional(),
        diNome: z.string().optional(),
        status: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const videoaulas = await getVideoaulasComDetalhes();
        
        if (!input) {
          return {
            items: videoaulas,
            total: videoaulas.length,
            offset: 0,
            limit: videoaulas.length,
          };
        }
        
        let filtered = videoaulas;
        
        // NOTA: Filtro por curso removido temporariamente
        // Disciplinas agora podem pertencer a múltiplos cursos (many-to-many)
        // TODO: Implementar filtro usando cursosDisciplinas
        if (input.cursoId) {
          // filtered = filtered.filter(v => v.curso?.id === input.cursoId);
          console.warn('Filtro por curso não implementado ainda');
        }
        
        // Filtrar por disciplina
        if (input.disciplinaCodigo) {
          filtered = filtered.filter(v => v.disciplina?.codigo === input.disciplinaCodigo);
        }
        
        // Filtrar por ano
        if (input.ano) {
          filtered = filtered.filter(v => v.oferta?.ano === input.ano);
        }
        
        // Filtrar por bimestre
        if (input.bimestre) {
          filtered = filtered.filter(v => v.oferta?.bimestreOperacional === input.bimestre);
        }
        
        // Filtrar por professor
        if (input.professorNome) {
          filtered = filtered.filter(v => 
            v.professor?.nome.toLowerCase().includes(input.professorNome!.toLowerCase())
          );
        }
        
        // Filtrar por DI
        if (input.diNome) {
          filtered = filtered.filter(v => 
            v.di?.nome.toLowerCase().includes(input.diNome!.toLowerCase())
          );
        }
        
        // Filtrar por status
        if (input.status) {
          filtered = filtered.filter(v => 
            v.videoaula.status?.toLowerCase().includes(input.status!.toLowerCase())
          );
        }
        
        // Busca por texto (título ou sinopse)
        if (input.search) {
          const searchLower = input.search.toLowerCase();
          filtered = filtered.filter(v => 
            v.videoaula.titulo.toLowerCase().includes(searchLower) ||
            v.videoaula.sinopse?.toLowerCase().includes(searchLower)
          );
        }
        
        // Paginação
        const total = filtered.length;
        const offset = input.offset || 0;
        const limit = input.limit || 50;
        
        const paginated = filtered.slice(offset, offset + limit);
        
        return {
          items: paginated,
          total,
          offset,
          limit,
        };
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const videoaulas = await getVideoaulasComDetalhes();
        return videoaulas.find(v => v.videoaula.id === input.id) || null;
      }),
  }),

  // ============================================
  // ESTATÍSTICAS
  // ============================================
  stats: router({
    overview: publicProcedure.query(async () => {
      return await getEstatisticasGerais();
    }),
    
    porCurso: publicProcedure.query(async () => {
      const videoaulas = await getVideoaulasComDetalhes();
      const cursos = await getAllCursos();
      const disciplinasComCurso = await getDisciplinasComCurso();
      
      // Mapear disciplina -> cursos
      const disciplinaCursosMap = new Map<number, number[]>();
      disciplinasComCurso.forEach(dc => {
        disciplinaCursosMap.set(dc.disciplina.id, dc.cursos.map((c: any) => c.id));
      });
      
      // Contar videoaulas por curso
      const cursosStats = cursos.map(curso => {
        const videoaulasDoCurso = videoaulas.filter(v => {
          const disciplinaId = v.disciplina?.id;
          if (!disciplinaId) return false;
          const cursosDaDisciplina = disciplinaCursosMap.get(disciplinaId) || [];
          return cursosDaDisciplina.includes(curso.id);
        });
        
        return {
          curso,
          total: videoaulasDoCurso.length,
          comLibras: videoaulasDoCurso.filter(v => v.videoaula.linkLibras).length,
          comAudiodescricao: videoaulasDoCurso.filter(v => v.videoaula.linkAudiodescricao).length,
          comCC: videoaulasDoCurso.filter(v => v.videoaula.ccLegenda).length,
        };
      });
      
      return cursosStats.filter(s => s.total > 0);
    }),
    
    porAno: publicProcedure.query(async () => {
      const videoaulas = await getVideoaulasComDetalhes();
      
      // Agrupar por ano
      const anoMap = new Map<number, number>();
      videoaulas.forEach(v => {
        const ano = v.oferta?.ano;
        if (ano) {
          anoMap.set(ano, (anoMap.get(ano) || 0) + 1);
        }
      });
      
      // Converter para array e ordenar
      const stats = Array.from(anoMap.entries())
        .map(([ano, total]) => ({ ano, total }))
        .sort((a, b) => a.ano - b.ano);
      
      return stats;
    }),
    
    porBimestre: publicProcedure.query(async () => {
      const videoaulas = await getVideoaulasComDetalhes();
      
      const stats = [1, 2, 3, 4].map(bimestre => {
        const videoaulasBimestre = videoaulas.filter(v => v.oferta?.bimestreOperacional === bimestre);
        return {
          bimestre,
          total: videoaulasBimestre.length,
          comLibras: videoaulasBimestre.filter(v => v.videoaula.linkLibras).length,
          comAudiodescricao: videoaulasBimestre.filter(v => v.videoaula.linkAudiodescricao).length,
          comCC: videoaulasBimestre.filter(v => v.videoaula.ccLegenda).length,
        };
      });
      
      return stats;
    }),
    
    porAnoBimestre: publicProcedure.query(async () => {
      const videoaulas = await getVideoaulasComDetalhes();
      
      // Agrupar por ano e bimestre
      const anosBimestresMap = new Map<number, { [key: string]: number }>();
      
      videoaulas.forEach(v => {
        const ano = v.oferta?.ano;
        const bimestre = v.oferta?.bimestreOperacional;
        
        if (ano && bimestre) {
          if (!anosBimestresMap.has(ano)) {
            anosBimestresMap.set(ano, { bim1: 0, bim2: 0, bim3: 0, bim4: 0 });
          }
          
          const bimestreKey = `bim${bimestre}`;
          const anoData = anosBimestresMap.get(ano)!;
          anoData[bimestreKey] = (anoData[bimestreKey] || 0) + 1;
        }
      });
      
      // Converter para array e ordenar por ano
      const stats = Array.from(anosBimestresMap.entries())
        .map(([ano, bimestres]) => ({
          ano,
          ...bimestres,
        }))
        .sort((a, b) => a.ano - b.ano);
      
      return stats;
    }),
    
    porStatus: publicProcedure.query(async () => {
      const videoaulas = await getVideoaulasComDetalhes();
      
      const statusMap = new Map<string, number>();
      
      videoaulas.forEach(v => {
        const status = v.videoaula.status || 'Não informado';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });
      
      return Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count,
      })).sort((a, b) => b.count - a.count);
    }),
    
    acessibilidade: publicProcedure.query(async () => {
      const videoaulas = await getVideoaulasComDetalhes();
      
      return {
        total: videoaulas.length,
        comLibras: videoaulas.filter(v => v.videoaula.linkLibras).length,
        comAudiodescricao: videoaulas.filter(v => v.videoaula.linkAudiodescricao).length,
        comCC: videoaulas.filter(v => v.videoaula.ccLegenda).length,
        comSlides: videoaulas.filter(v => v.videoaula.slidesDisponivel).length,
        completas: videoaulas.filter(v => 
          v.videoaula.linkLibras && 
          v.videoaula.linkAudiodescricao && 
          v.videoaula.ccLegenda
        ).length,
      };
    }),
  }),

  // ============================================
  // ADMIN ROUTERS
  // ============================================
  admin: router({
    videoaulas: router({
      create: publicProcedure
        .input(z.object({
          disciplinaId: z.number(),
          ano: z.number(),
          bimestreOperacional: z.number(),
          professorId: z.number().optional(),
          diId: z.number().optional(),
          semana: z.number(),
          numeroAula: z.number(),
          titulo: z.string(),
          sinopse: z.string().optional(),
          linkYoutubeOriginal: z.string().optional(),
          slidesDisponivel: z.boolean().default(false),
          status: z.string().optional(),
          idTvCultura: z.string().optional(),
          duracaoMinutos: z.number().optional(),
          linkLibras: z.string().optional(),
          linkAudiodescricao: z.string().optional(),
          ccLegenda: z.boolean().default(false),
          linkDownload: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          // Criar ou obter oferta da disciplina
          const ofertaId = await getOrCreateOfertaDisciplina(
            input.disciplinaId,
            input.ano,
            input.bimestreOperacional,
            input.professorId,
            input.diId
          );
          
          // Criar videoaula
          const videoaulaId = await createVideoaula({
            ofertaDisciplinaId: ofertaId,
            semana: input.semana,
            numeroAula: input.numeroAula,
            titulo: input.titulo,
            sinopse: input.sinopse || null,
            linkYoutubeOriginal: input.linkYoutubeOriginal || null,
            slidesDisponivel: input.slidesDisponivel,
            status: input.status || null,
            idTvCultura: input.idTvCultura || null,
            duracaoMinutos: input.duracaoMinutos || null,
            linkLibras: input.linkLibras || null,
            linkAudiodescricao: input.linkAudiodescricao || null,
            ccLegenda: input.ccLegenda,
            linkDownload: input.linkDownload || null,
          });
          
          return { id: videoaulaId, success: true };
        }),
      
      update: publicProcedure
        .input(z.object({
          id: z.number(),
          semana: z.number().optional(),
          numeroAula: z.number().optional(),
          titulo: z.string().optional(),
          sinopse: z.string().optional(),
          linkYoutubeOriginal: z.string().optional(),
          slidesDisponivel: z.boolean().optional(),
          status: z.string().optional(),
          idTvCultura: z.string().optional(),
          duracaoMinutos: z.number().optional(),
          linkLibras: z.string().optional(),
          linkAudiodescricao: z.string().optional(),
          ccLegenda: z.boolean().optional(),
          linkDownload: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await updateVideoaula(id, data);
          return { success: true };
        }),
      
      delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteVideoaula(input.id);
          return { success: true };
        }),
    }),

    professores: router({
      create: publicProcedure
        .input(z.object({
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await createProfessor(input);
          return { success: true };
        }),

      update: publicProcedure
        .input(z.object({
          id: z.number(),
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await updateProfessor(input.id, { nome: input.nome });
          return { success: true };
        }),

      delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteProfessor(input.id);
          return { success: true };
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getManusProf(input.id);
        }),
    }),

    disciplinas: router({
      create: publicProcedure
        .input(z.object({
          codigo: z.string().min(1),
          nome: z.string().min(1),
          cargaHoraria: z.number(),
          cursoIds: z.array(z.number()),
        }))
        .mutation(async ({ input }) => {
          await createDisciplina(input);
          return { success: true };
        }),

      update: publicProcedure
        .input(z.object({
          id: z.number(),
          codigo: z.string().min(1),
          nome: z.string().min(1),
          cargaHoraria: z.number(),
          cursoIds: z.array(z.number()),
        }))
        .mutation(async ({ input }) => {
          await updateDisciplina(input.id, {
            codigo: input.codigo,
            nome: input.nome,
            cargaHoraria: input.cargaHoraria,
            cursoIds: input.cursoIds,
          });
          return { success: true };
        }),

      delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteDisciplina(input.id);
          return { success: true };
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getManusDisciplina(input.id);
        }),
    }),

    designers: router({
      create: publicProcedure
        .input(z.object({
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await createDesignerInstrucional(input);
          return { success: true };
        }),

      update: publicProcedure
        .input(z.object({
          id: z.number(),
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await updateDesignerInstrucional(input.id, { nome: input.nome });
          return { success: true };
        }),

      delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteDesignerInstrucional(input.id);
          return { success: true };
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getManusDesigner(input.id);
        }),
    }),

    cursos: router({
      create: publicProcedure
        .input(z.object({
          eixo: z.string().min(1),
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await createCurso(input);
          return { success: true };
        }),

      update: publicProcedure
        .input(z.object({
          id: z.number(),
          eixo: z.string().min(1),
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await updateCurso(input.id, { eixo: input.eixo, nome: input.nome });
          return { success: true };
        }),

      delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteCurso(input.id);
          return { success: true };
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getCursoById(input.id);
        }),
    }),
    
    import: router({
      linksAcessibilidade: publicProcedure
        .input(z.array(z.object({
          idTvCultura: z.string().min(1),
          linkLibras: z.string().optional(),
          linkAudiodescricao: z.string().optional(),
          ccLegenda: z.boolean().optional(),
        })))
        .mutation(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          const results = [];
          
          for (const update of input) {
            try {
              const [videoaula] = await db.select().from(videoaulas).where(eq(videoaulas.idTvCultura, update.idTvCultura)).limit(1);
              
              if (!videoaula) {
                results.push({ idTvCultura: update.idTvCultura, status: 'error', message: 'Videoaula não encontrada' });
                continue;
              }
              
              await db.update(videoaulas)
                .set({
                  linkLibras: update.linkLibras || videoaula.linkLibras,
                  linkAudiodescricao: update.linkAudiodescricao || videoaula.linkAudiodescricao,
                  ccLegenda: update.ccLegenda !== undefined ? update.ccLegenda : videoaula.ccLegenda,
                })
                .where(eq(videoaulas.id, videoaula.id));
              
              results.push({ idTvCultura: update.idTvCultura, status: 'success', message: 'Atualizada com sucesso' });
            } catch (error) {
              results.push({ idTvCultura: update.idTvCultura, status: 'error', message: error instanceof Error ? error.message : 'Erro desconhecido' });
            }
          }
          
          return results;
        }),
      
      disciplinas: publicProcedure
        .input(z.array(z.object({
          codigo: z.string().min(1),
          nome: z.string().min(1),
          cursos: z.array(z.number()).optional(), // IDs dos cursos
        })))
        .mutation(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          const results = [];
          
          for (const disc of input) {
            try {
              // Verificar se disciplina já existe
              const [existing] = await db.select().from(disciplinas).where(eq(disciplinas.codigo, disc.codigo)).limit(1);
              
              if (existing) {
                results.push({ codigo: disc.codigo, status: 'error', message: 'Disciplina já existe' });
                continue;
              }
              
              // Criar disciplina
              const [novaDisciplina] = await db.insert(disciplinas).values({
                codigo: disc.codigo,
                nome: disc.nome,
              }).$returningId();
              
              // Associar cursos se fornecidos
              if (disc.cursos && disc.cursos.length > 0) {
                for (const cursoId of disc.cursos) {
                  await db.insert(cursosDisciplinas).values({
                    cursoId,
                    disciplinaId: novaDisciplina.id,
                  });
                }
              }
              
              results.push({ codigo: disc.codigo, status: 'success', message: 'Criada com sucesso' });
            } catch (error) {
              results.push({ codigo: disc.codigo, status: 'error', message: error instanceof Error ? error.message : 'Erro desconhecido' });
            }
          }
          
          return results;
        }),
      
      videoaulas: publicProcedure
        .input(z.array(z.object({
          idTvCultura: z.string().min(1),
          titulo: z.string().min(1),
          codigoDisciplina: z.string().min(1),
          ano: z.number(),
          bimestreOperacional: z.number().min(1).max(4),
          semana: z.number(),
          numeroAula: z.number(),
          sinopse: z.string().optional(),
          linkYoutubeOriginal: z.string().optional(),
          duracaoMinutos: z.number().optional(),
        })))
        .mutation(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          const results = [];
          
          for (const video of input) {
            try {
              // Verificar se videoaula já existe
              const [existing] = await db.select().from(videoaulas).where(eq(videoaulas.idTvCultura, video.idTvCultura)).limit(1);
              
              if (existing) {
                results.push({ idTvCultura: video.idTvCultura, status: 'error', message: 'Videoaula já existe' });
                continue;
              }
              
              // Buscar disciplina
              const [disciplina] = await db.select().from(disciplinas).where(eq(disciplinas.codigo, video.codigoDisciplina)).limit(1);
              
              if (!disciplina) {
                results.push({ idTvCultura: video.idTvCultura, status: 'error', message: 'Disciplina não encontrada' });
                continue;
              }
              
              // Buscar ou criar oferta de disciplina
              let [oferta] = await db.select().from(ofertasDisciplinas)
                .where(
                  and(
                    eq(ofertasDisciplinas.disciplinaId, disciplina.id),
                    eq(ofertasDisciplinas.ano, video.ano),
                    eq(ofertasDisciplinas.bimestreOperacional, video.bimestreOperacional)
                  )
                )
                .limit(1);
              
              if (!oferta) {
                const [novaOferta] = await db.insert(ofertasDisciplinas).values({
                  disciplinaId: disciplina.id,
                  ano: video.ano,
                  bimestreOperacional: video.bimestreOperacional,
                  tipo: 'OFERTA',
                }).$returningId();
                
                [oferta] = await db.select().from(ofertasDisciplinas).where(eq(ofertasDisciplinas.id, novaOferta.id)).limit(1);
              }
              
              // Criar videoaula
              await db.insert(videoaulas).values({
                ofertaDisciplinaId: oferta.id,
                semana: video.semana,
                numeroAula: video.numeroAula,
                titulo: video.titulo,
                sinopse: video.sinopse,
                linkYoutubeOriginal: video.linkYoutubeOriginal,
                idTvCultura: video.idTvCultura,
                duracaoMinutos: video.duracaoMinutos,
              });
              
              results.push({ idTvCultura: video.idTvCultura, status: 'success', message: 'Criada com sucesso' });
            } catch (error) {
              results.push({ idTvCultura: video.idTvCultura, status: 'error', message: error instanceof Error ? error.message : 'Erro desconhecido' });
            }
          }
          
          return results;
        }),
    }),
    
    historico: router({
      salvar: publicProcedure
        .input(z.object({
          tipo: z.enum(["acessibilidade", "disciplinas", "videoaulas"]),
          nomeArquivo: z.string(),
          totalLinhas: z.number(),
          sucessos: z.number(),
          erros: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          
          await db.insert(historicoImportacoes).values({
            tipo: input.tipo,
            nomeArquivo: input.nomeArquivo,
            usuarioId: ctx.user?.id || 0,
            totalLinhas: input.totalLinhas,
            sucessos: input.sucessos,
            erros: input.erros,
          });
          
          return { success: true };
        }),
      
      listar: publicProcedure
        .query(async ({ ctx }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          
          const historico = await db
            .select({
              id: historicoImportacoes.id,
              tipo: historicoImportacoes.tipo,
              nomeArquivo: historicoImportacoes.nomeArquivo,
              usuarioId: historicoImportacoes.usuarioId,
              usuarioNome: users.name,
              totalLinhas: historicoImportacoes.totalLinhas,
              sucessos: historicoImportacoes.sucessos,
              erros: historicoImportacoes.erros,
              createdAt: historicoImportacoes.createdAt,
            })
            .from(historicoImportacoes)
            .leftJoin(users, eq(historicoImportacoes.usuarioId, users.id))
            .orderBy(desc(historicoImportacoes.createdAt));
          
          return historico;
        }),
    }),
  }),

  // ============================================
  // GERENCIAMENTO DE USUÁRIOS
  // ============================================
  users: router({
    // Listar todos os usuários (apenas admin)
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(users).orderBy(desc(users.createdAt));
    }),

    // Promover usuário (viewer → admin)
    promote: publicProcedure
      .input(z.object({ 
        userId: z.number(),
        targetOpenId: z.string()
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        
        // Proteção: não pode modificar o owner
        if (input.targetOpenId === ENV.ownerOpenId) {
          throw new Error('Não é possível modificar o owner');
        }
        
        await db.update(users)
          .set({ role: 'admin' })
          .where(eq(users.id, input.userId));
        
        return { success: true };
      }),

    // Rebaixar usuário (admin → viewer)
    demote: publicProcedure
      .input(z.object({ 
        userId: z.number(),
        targetOpenId: z.string()
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        
        // Proteção: não pode modificar o owner
        if (input.targetOpenId === ENV.ownerOpenId) {
          throw new Error('Não é possível modificar o owner');
        }
        
        await db.update(users)
          .set({ role: 'viewer' })
          .where(eq(users.id, input.userId));
        
        return { success: true };
      }),
  }),

  // Endpoint temporário para exportar dados
  export: router({
    allData: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [cursosData, disciplinasData, professoresData, designersData, videoaulasData, cursosDisciplinasData, ofertasData] = await Promise.all([
        getAllCursos(),
        getAllDisciplinas(),
        getAllProfessores(),
        getAllDesignersInstrucionais(),
        getVideoaulasComDetalhes(),
        db.select().from(cursosDisciplinas),
        db.select().from(ofertasDisciplinas),
      ]);

      return {
        cursos: cursosData,
        disciplinas: disciplinasData,
        professores: professoresData,
        designers: designersData,
        videoaulas: videoaulasData,
        cursosDisciplinas: cursosDisciplinasData,
        ofertasDisciplinas: ofertasData,
      };
    }),

    // Gerenciamento de usuários
    usuarios: router({  
      list: publicProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
        return allUsers;
      }),

      promoverParaAdmin: publicProcedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          await db.update(users)
            .set({ role: 'admin' })
            .where(eq(users.openId, input.userId));
          return { success: true };
        }),

      rebaixarParaUser: publicProcedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new Error('Database not available');
          await db.update(users)
            .set({ role: 'viewer' })
            .where(eq(users.openId, input.userId));
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
