-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(100) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `disabled` INTEGER NULL DEFAULT 0,
    `deleted` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(50) NULL,
    `avatar` VARCHAR(255) NULL,
    `email` VARCHAR(50) NULL,
    `phone` VARCHAR(20) NULL,
    `gender` ENUM('MA', 'FE', 'OT') NOT NULL DEFAULT 'MA',
    `birthday` DATETIME(3) NULL,
    `description` VARCHAR(150) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `profile_email_key`(`email`),
    UNIQUE INDEX `profile_phone_key`(`phone`),
    UNIQUE INDEX `profile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(150) NULL,
    `disabled` INTEGER NULL DEFAULT 0,
    `deleted` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_on_role` (
    `role_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`role_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('DIRECTORY', 'MENU', 'BUTTON') NOT NULL DEFAULT 'MENU',
    `button` VARCHAR(191) NULL,
    `name` VARCHAR(225) NOT NULL,
    `path` VARCHAR(225) NULL,
    `component` VARCHAR(225) NULL,
    `title` VARCHAR(225) NULL,
    `i18n_key` VARCHAR(225) NULL,
    `order` INTEGER NULL,
    `keep_alive` BOOLEAN NULL DEFAULT false,
    `constant` BOOLEAN NOT NULL DEFAULT false,
    `icon` VARCHAR(225) NULL,
    `local_icon` VARCHAR(225) NULL,
    `href` VARCHAR(225) NULL,
    `hide_in_menu` BOOLEAN NULL DEFAULT false,
    `active_menu` VARCHAR(225) NULL,
    `multi_tab` BOOLEAN NULL DEFAULT false,
    `fixed_index_tab` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `pid` INTEGER NULL,

    UNIQUE INDEX `permission_button_key`(`button`),
    UNIQUE INDEX `permission_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_on_permission` (
    `permission_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,

    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_on_role` ADD CONSTRAINT `user_on_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_on_role` ADD CONSTRAINT `user_on_role_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permission` ADD CONSTRAINT `permission_pid_fkey` FOREIGN KEY (`pid`) REFERENCES `permission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_on_permission` ADD CONSTRAINT `role_on_permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_on_permission` ADD CONSTRAINT `role_on_permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
