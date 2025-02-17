-- Drop the existing foreign key constraint
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_user_id_users_id_fk`;

-- Add the new foreign key constraint referencing the clients table
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_clients_id_fk` 
FOREIGN KEY (`user_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE; 