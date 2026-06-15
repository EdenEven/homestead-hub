CREATE TABLE `partnerApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactName` varchar(200) NOT NULL,
	`company` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`website` varchar(500),
	`phone` varchar(50),
	`partnerType` enum('seed_supplier','product_advertiser','affiliate','sponsored_content','other') NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','reviewing','approved','declined') NOT NULL DEFAULT 'new',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partnerApplications_id` PRIMARY KEY(`id`)
);
