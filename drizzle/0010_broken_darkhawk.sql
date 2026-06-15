CREATE TABLE `homesteadFeed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('market','weather','seasonal','tip','news') NOT NULL,
	`headline` varchar(300) NOT NULL,
	`body` text NOT NULL,
	`source` varchar(200),
	`sourceUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `homesteadFeed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolDailyExpansions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`type` enum('quiz_question','fun_fact','activity') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `schoolDailyExpansions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillTips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skillSlug` varchar(100) NOT NULL,
	`tip` text NOT NULL,
	`source` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `skillTips_id` PRIMARY KEY(`id`)
);
