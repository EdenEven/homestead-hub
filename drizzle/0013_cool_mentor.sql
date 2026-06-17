CREATE TABLE `offlineKitWaitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`zipCode` varchar(20),
	`interestedIn` varchar(100) NOT NULL DEFAULT 'full-kit',
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offlineKitWaitlist_id` PRIMARY KEY(`id`)
);
