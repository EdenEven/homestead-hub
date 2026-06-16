CREATE TABLE `communityEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`eventDate` timestamp NOT NULL,
	`endDate` timestamp,
	`location` varchar(255) NOT NULL,
	`address` varchar(500),
	`category` enum('festival','market','workshop','swap_meet','community','homestead_tour','other') NOT NULL DEFAULT 'community',
	`imageUrl` varchar(1000),
	`externalUrl` varchar(1000),
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `communityEvents_id` PRIMARY KEY(`id`)
);
