-- Drop the existing foreign key constraint if it exists
ALTER TABLE `sessions` DROP FOREIGN KEY IF EXISTS `sessions_user_id_users_id_fk`;

-- Create the clients table
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(255),
  `userwaregno` varchar(255),
  `password` varchar(255),
  `api_key` varchar(255),
  PRIMARY KEY (`id`)
);

-- Add the new foreign key constraint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_clients_id_fk` 
FOREIGN KEY (`user_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE; 