import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
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
        
        // Filtrar por curso
        if (input.cursoId) {
          filtered = filtered.filter(v => v.curso?.id === input.cursoId);
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
      
      return cursos.map(curso => {
        const videoaulasCurso = videoaulas.filter(v => v.curso?.id === curso.id);
        return {
          curso,
          total: videoaulasCurso.length,
          comLibras: videoaulasCurso.filter(v => v.videoaula.linkLibras).length,
          comAudiodescricao: videoaulasCurso.filter(v => v.videoaula.linkAudiodescricao).length,
          comCC: videoaulasCurso.filter(v => v.videoaula.ccLegenda).length,
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
});

export type AppRouter = typeof appRouter;
