CREATE TABLE `cursos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eixo` varchar(255) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cursos_id` PRIMARY KEY(`id`),
	CONSTRAINT `cursos_nome_unique` UNIQUE(`nome`)
);
--> statement-breakpoint
CREATE TABLE `designersInstrucionais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `designersInstrucionais_id` PRIMARY KEY(`id`),
	CONSTRAINT `designersInstrucionais_nome_unique` UNIQUE(`nome`)
);
--> statement-breakpoint
CREATE TABLE `disciplinas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`nome` varchar(500) NOT NULL,
	`cargaHoraria` int NOT NULL DEFAULT 0,
	`anoCurso` int NOT NULL DEFAULT 1,
	`bimestrePedagogico` int NOT NULL DEFAULT 1,
	`cursoId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `disciplinas_id` PRIMARY KEY(`id`),
	CONSTRAINT `disciplinas_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `ofertasDisciplinas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`disciplinaId` int NOT NULL,
	`ano` int NOT NULL,
	`bimestreOperacional` int NOT NULL,
	`professorId` int,
	`diId` int,
	`tipo` enum('OFERTA','REOFERTA') NOT NULL DEFAULT 'OFERTA',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ofertasDisciplinas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professores_id` PRIMARY KEY(`id`),
	CONSTRAINT `professores_nome_unique` UNIQUE(`nome`)
);
--> statement-breakpoint
CREATE TABLE `videoaulas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ofertaDisciplinaId` int NOT NULL,
	`semana` int NOT NULL,
	`numeroAula` int NOT NULL,
	`titulo` text NOT NULL,
	`sinopse` text,
	`linkYoutubeOriginal` text,
	`slidesDisponivel` boolean NOT NULL DEFAULT false,
	`status` varchar(100),
	`idTvCultura` varchar(100),
	`duracaoMinutos` int,
	`linkLibras` text,
	`linkAudiodescricao` text,
	`ccLegenda` boolean NOT NULL DEFAULT false,
	`linkDownload` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videoaulas_id` PRIMARY KEY(`id`)
);
