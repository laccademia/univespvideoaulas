import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { disciplinas, videoaulas, ofertasDisciplinas, cursosDisciplinas, historicoImportacoes, users } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
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
  createProfessor,
  updateProfessor,
  deleteProfessor,
  getProfessorById,
  createDisciplina,
  updateDisciplina,
  deleteDisciplina,
  getDisciplinaById,
  createDesignerInstrucional,
  updateDesignerInstrucional,
  deleteDesignerInstrucional,
  getDesignerInstrucionalById,
  createCurso,
  updateCurso,
  deleteCurso,
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

    professores: router({
      create: adminProcedure
        .input(z.object({
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await createProfessor(input);
          return { success: true };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await updateProfessor(input.id, { nome: input.nome });
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteProfessor(input.id);
          return { success: true };
        }),

      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getProfessorById(input.id);
        }),
    }),

    disciplinas: router({
      create: adminProcedure
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

      update: adminProcedure
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

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteDisciplina(input.id);
          return { success: true };
        }),

      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getDisciplinaById(input.id);
        }),
    }),

    designers: router({
      create: adminProcedure
        .input(z.object({
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await createDesignerInstrucional(input);
          return { success: true };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await updateDesignerInstrucional(input.id, { nome: input.nome });
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteDesignerInstrucional(input.id);
          return { success: true };
        }),

      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getDesignerInstrucionalById(input.id);
        }),
    }),

    cursos: router({
      create: adminProcedure
        .input(z.object({
          eixo: z.string().min(1),
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await createCurso(input);
          return { success: true };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          eixo: z.string().min(1),
          nome: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          await updateCurso(input.id, { eixo: input.eixo, nome: input.nome });
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteCurso(input.id);
          return { success: true };
        }),

      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return await getCursoById(input.id);
        }),
    }),
    
    import: router({
      linksAcessibilidade: adminProcedure
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
    }),
    
    historico: router({
      salvar: adminProcedure
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
            usuarioId: ctx.user.id,
            totalLinhas: input.totalLinhas,
            sucessos: input.sucessos,
            erros: input.erros,
          });
          
          return { success: true };
        }),
      
      listar: adminProcedure
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
});

export type AppRouter = typeof appRouter;
