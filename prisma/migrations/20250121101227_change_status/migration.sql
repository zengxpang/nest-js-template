/*
  Warnings:

  - You are about to alter the column `disabled` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `deleted` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `disabled` on the `users` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `deleted` on the `users` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `roles` MODIFY `disabled` VARCHAR(191) NULL DEFAULT '0',
    MODIFY `deleted` VARCHAR(191) NULL DEFAULT '0';

-- AlterTable
ALTER TABLE `users` MODIFY `disabled` VARCHAR(191) NULL DEFAULT '0',
    MODIFY `deleted` VARCHAR(191) NULL DEFAULT '0';
