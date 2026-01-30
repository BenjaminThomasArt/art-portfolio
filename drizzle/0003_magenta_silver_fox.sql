CREATE TABLE `prints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`image_key` varchar(512) NOT NULL,
	`size_info` varchar(255),
	`price` varchar(50),
	`available` int NOT NULL DEFAULT 1,
	`display_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prints_id` PRIMARY KEY(`id`)
);
