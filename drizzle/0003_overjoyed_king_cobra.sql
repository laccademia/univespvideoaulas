CREATE TABLE `historicoImportacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('acessibilidade','disciplinas','videoaulas') NOT NULL,
	`nomeArquivo` varchar(255) NOT NULL,
	`usuarioId` int NOT NULL,
	`totalLinhas` int NOT NULL,
	`sucessos` int NOT NULL,
	`erros` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `historicoImportacoes_id` PRIMARY KEY(`id`)
);
