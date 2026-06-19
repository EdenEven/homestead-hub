CREATE TABLE `socialQueue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blogPostId` int,
	`platform` enum('facebook','instagram','twitter') NOT NULL DEFAULT 'facebook',
	`caption` text NOT NULL,
	`hashtags` varchar(500),
	`status` enum('pending','approved','posted','failed') NOT NULL DEFAULT 'pending',
	`scheduledAt` timestamp,
	`postedAt` timestamp,
	`fbPostId` varchar(255),
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `socialQueue_id` PRIMARY KEY(`id`)
);
