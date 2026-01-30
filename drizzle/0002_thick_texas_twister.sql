ALTER TABLE `artworks` ADD `for_sale` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `artworks` ADD `price` varchar(50);--> statement-breakpoint
ALTER TABLE `artworks` ADD `paypal_button_id` text;