CREATE TABLE `artist_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`bio` text NOT NULL,
	`profile_image_url` text,
	`profile_image_key` varchar(512),
	`instagram_handle` varchar(100),
	`instagram_url` varchar(255),
	`facebook_url` varchar(255),
	`twitter_url` varchar(255),
	`linkedin_url` varchar(255),
	`website_url` varchar(255),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artist_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `artworks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`image_key` varchar(512) NOT NULL,
	`year` int,
	`medium` varchar(255),
	`dimensions` varchar(255),
	`available` enum('yes','no','sold') NOT NULL DEFAULT 'yes',
	`featured` int NOT NULL DEFAULT 0,
	`display_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artworks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('contact','print','commission') NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`message` text NOT NULL,
	`artwork_id` int,
	`status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
