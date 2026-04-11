CREATE TABLE `emailSubscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(100),
	`source` varchar(100) NOT NULL DEFAULT 'welcome-popup',
	`isConfirmed` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailSubscribers_email_unique` UNIQUE(`email`)
);
