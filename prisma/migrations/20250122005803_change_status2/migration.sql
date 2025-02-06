/*
  Warnings:

  - You are about to alter the column `disabled` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `deleted` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `disabled` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `deleted` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `roles` MODIFY `disabled` INTEGER NULL DEFAULT 0,
    MODIFY `deleted` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` MODIFY `disabled` INTEGER NULL DEFAULT 0,
    MODIFY `deleted` INTEGER NULL DEFAULT 0;
