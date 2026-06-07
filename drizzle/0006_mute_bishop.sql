CREATE TABLE `schoolCourses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`createdBy` int,
	`title` varchar(300) NOT NULL,
	`description` text NOT NULL,
	`subject` varchar(100) NOT NULL,
	`gradeMin` int NOT NULL,
	`gradeMax` int NOT NULL,
	`coverImageUrl` text,
	`isPrebuilt` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schoolCourses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolGradeEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`subject` varchar(100) NOT NULL,
	`assignmentTitle` varchar(300) NOT NULL,
	`grade` varchar(10) NOT NULL,
	`notes` text,
	`gradedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `schoolGradeEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolLessonProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`lessonId` int NOT NULL,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`quizScore` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `schoolLessonProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolLessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`objective` text,
	`content` text,
	`videoUrl` text,
	`materials` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schoolLessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolQuizQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`question` text NOT NULL,
	`optionA` varchar(500) NOT NULL,
	`optionB` varchar(500) NOT NULL,
	`optionC` varchar(500),
	`optionD` varchar(500),
	`correctAnswer` enum('A','B','C','D') NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `schoolQuizQuestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolQuizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `schoolQuizzes_id` PRIMARY KEY(`id`),
	CONSTRAINT `schoolQuizzes_lessonId_unique` UNIQUE(`lessonId`)
);
--> statement-breakpoint
CREATE TABLE `schoolStudents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentUserId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`gradeLevel` int NOT NULL,
	`avatarUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schoolStudents_id` PRIMARY KEY(`id`)
);
