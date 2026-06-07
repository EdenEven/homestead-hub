CREATE TABLE `schoolStudyGuides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`studentId` int,
	`createdByUserId` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`content` text NOT NULL,
	`gradeLevel` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `schoolStudyGuides_id` PRIMARY KEY(`id`)
);
