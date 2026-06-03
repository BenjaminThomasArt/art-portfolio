CREATE TABLE `bambina_checklist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`phase` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`completed` int NOT NULL DEFAULT 0,
	`notes` text,
	`snoozed_weeks` int NOT NULL DEFAULT 0,
	`due_week` int,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bambina_checklist_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bambina_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`title` varchar(255),
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bambina_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bambina_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` varchar(500) NOT NULL,
	`amount` varchar(100) NOT NULL,
	`currency` varchar(10) NOT NULL,
	`amount_numeric` int,
	`due_month` varchar(50),
	`paid` int NOT NULL DEFAULT 0,
	`paid_date` timestamp,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bambina_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bambina_shopping` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`notes` text,
	`purchased` int NOT NULL DEFAULT 0,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bambina_shopping_id` PRIMARY KEY(`id`)
);
