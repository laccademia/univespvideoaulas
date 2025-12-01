import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
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
  createVideoaula,
  updateVideoaula,
  deleteVideoaula,
  getOrCreateOfertaDisciplina,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
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
      // NOTA: Estatísticas por curso removidas temporariamente
      // Disciplinas agora podem pertencer a múltiplos cursos (many-to-many)
      // TODO: Implementar usando cursosDisciplinas
      const cursos = await getAllCursos();
      
      return cursos.map(curso => {
        return {
          curso,
          total: 0,
          comLibras: 0,
          comAudiodescricao: 0,
          comCC: 0,
        };
      });
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
      create: adminProcedure
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
      
      update: adminProcedure
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
      
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteVideoaula(input.id);
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
