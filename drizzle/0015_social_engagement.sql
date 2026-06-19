CREATE TABLE `socialEngagement` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` enum('facebook','instagram') NOT NULL,
	`sourcePostId` varchar(255) NOT NULL,
	`commenterName` varchar(255),
	`commentId` varchar(255),
	`message` text,
	`rawPayload` text,
	`replied` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialEngagement_id` PRIMARY KEY(`id`)
);
