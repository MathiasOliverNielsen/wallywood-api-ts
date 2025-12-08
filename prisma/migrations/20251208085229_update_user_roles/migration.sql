/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `cartlines` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `genres` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `posters` MODIFY `description` VARCHAR(191) NOT NULL,
    ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `userratings` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL,
    ALTER COLUMN `createdAt` DROP DEFAULT;
