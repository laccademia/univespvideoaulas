CREATE TYPE "public"."role" AS ENUM('viewer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."tipo_importacao" AS ENUM('acessibilidade', 'disciplinas', 'videoaulas');--> statement-breakpoint
CREATE TYPE "public"."tipo_oferta" AS ENUM('OFERTA', 'REOFERTA');--> statement-breakpoint
CREATE TABLE "cursos" (
	"id" serial PRIMARY KEY NOT NULL,
	"eixo" varchar(255) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cursos_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "cursosDisciplinas" (
	"id" serial PRIMARY KEY NOT NULL,
	"cursoId" integer NOT NULL,
	"disciplinaId" integer NOT NULL,
	"anoCurso" integer DEFAULT 1 NOT NULL,
	"bimestrePedagogico" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "designersInstrucionais" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "designersInstrucionais_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "disciplinas" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(50) NOT NULL,
	"nome" varchar(500) NOT NULL,
	"cargaHoraria" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "disciplinas_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "historicoImportacoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" "tipo_importacao" NOT NULL,
	"nomeArquivo" varchar(255) NOT NULL,
	"usuarioId" integer NOT NULL,
	"totalLinhas" integer NOT NULL,
	"sucessos" integer NOT NULL,
	"erros" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ofertasDisciplinas" (
	"id" serial PRIMARY KEY NOT NULL,
	"disciplinaId" integer NOT NULL,
	"ano" integer NOT NULL,
	"bimestreOperacional" integer NOT NULL,
	"professorId" integer,
	"diId" integer,
	"tipo" "tipo_oferta" DEFAULT 'OFERTA' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professores" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "professores_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'viewer' NOT NULL,
	"password_hash" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "videoaulas" (
	"id" serial PRIMARY KEY NOT NULL,
	"ofertaDisciplinaId" integer NOT NULL,
	"semana" integer NOT NULL,
	"numeroAula" integer NOT NULL,
	"titulo" text NOT NULL,
	"sinopse" text,
	"linkYoutubeOriginal" text,
	"slidesDisponivel" boolean DEFAULT false NOT NULL,
	"status" varchar(100),
	"idTvCultura" varchar(100),
	"duracaoMinutos" integer,
	"linkLibras" text,
	"linkAudiodescricao" text,
	"ccLegenda" boolean DEFAULT false NOT NULL,
	"linkDownload" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
