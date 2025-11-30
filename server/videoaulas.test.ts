import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Videoaulas Router", () => {
  it("should list videoaulas with pagination", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.videoaulas.list({ limit: 10, offset: 0 });

    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("offset");
    expect(result).toHaveProperty("limit");
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBeLessThanOrEqual(10);
  });

  it("should return videoaula by id", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // First get a list to get a valid ID
    const list = await caller.videoaulas.list({ limit: 1 });
    
    if (list.items.length > 0) {
      const firstId = list.items[0]!.videoaula.id;
      const videoaula = await caller.videoaulas.getById({ id: firstId });

      expect(videoaula).toBeDefined();
      expect(videoaula?.videoaula.id).toBe(firstId);
    }
  });
});

describe("Cursos Router", () => {
  it("should list all cursos", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const cursos = await caller.cursos.list();

    expect(Array.isArray(cursos)).toBe(true);
    expect(cursos.length).toBeGreaterThan(0);
    
    if (cursos.length > 0) {
      expect(cursos[0]).toHaveProperty("id");
      expect(cursos[0]).toHaveProperty("nome");
      expect(cursos[0]).toHaveProperty("eixo");
    }
  });

  it("should get curso by id", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const cursos = await caller.cursos.list();
    
    if (cursos.length > 0) {
      const firstId = cursos[0]!.id;
      const curso = await caller.cursos.getById({ id: firstId });

      expect(curso).toBeDefined();
      expect(curso?.id).toBe(firstId);
    }
  });
});

describe("Stats Router", () => {
  it("should return overview statistics", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.stats.overview();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalVideoaulas");
    expect(stats).toHaveProperty("totalDisciplinas");
    expect(stats).toHaveProperty("totalCursos");
    expect(stats).toHaveProperty("totalProfessores");
    expect(stats).toHaveProperty("acessibilidade");
    
    expect(typeof stats?.totalVideoaulas).toBe("number");
    expect(stats?.totalVideoaulas).toBeGreaterThan(0);
  });

  it("should return accessibility statistics", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const acessibilidade = await caller.stats.acessibilidade();

    expect(acessibilidade).toBeDefined();
    expect(acessibilidade).toHaveProperty("total");
    expect(acessibilidade).toHaveProperty("comLibras");
    expect(acessibilidade).toHaveProperty("comAudiodescricao");
    expect(acessibilidade).toHaveProperty("comCC");
    expect(acessibilidade).toHaveProperty("completas");
  });

  it("should return stats by bimestre", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const porBimestre = await caller.stats.porBimestre();

    expect(Array.isArray(porBimestre)).toBe(true);
    expect(porBimestre.length).toBe(4); // 4 bimestres
    
    if (porBimestre.length > 0) {
      expect(porBimestre[0]).toHaveProperty("bimestre");
      expect(porBimestre[0]).toHaveProperty("total");
    }
  });
});

describe("Professores Router", () => {
  it("should list all professores", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const professores = await caller.professores.list();

    expect(Array.isArray(professores)).toBe(true);
    expect(professores.length).toBeGreaterThan(0);
    
    if (professores.length > 0) {
      expect(professores[0]).toHaveProperty("id");
      expect(professores[0]).toHaveProperty("nome");
    }
  });
});

describe("Designers Instrucionais Router", () => {
  it("should list all designers instrucionais", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const dis = await caller.dis.list();

    expect(Array.isArray(dis)).toBe(true);
    expect(dis.length).toBeGreaterThan(0);
    
    if (dis.length > 0) {
      expect(dis[0]).toHaveProperty("id");
      expect(dis[0]).toHaveProperty("nome");
    }
  });
});
