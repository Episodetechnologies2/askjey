-- 1. Create Categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL DEFAULT '',
  `module_type` VARCHAR(191) NOT NULL DEFAULT 'work',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY `categories_name_module_type_key` (`name`, `module_type`),
  UNIQUE KEY `categories_slug_module_type_key` (`slug`, `module_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Admins table (User model)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(191) NOT NULL,
  `avatar_url` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create Works table
CREATE TABLE IF NOT EXISTS `works` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `category_id` INT DEFAULT NULL,
  `year` VARCHAR(191) NOT NULL DEFAULT '2026',
  `client` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL,
  `location` VARCHAR(191) NOT NULL,
  `duration` VARCHAR(191) DEFAULT NULL,
  `industry` VARCHAR(191) DEFAULT NULL,
  `short_description` TEXT NOT NULL,
  `long_description` TEXT NOT NULL,
  `services` JSON DEFAULT NULL,
  `technologies` JSON DEFAULT NULL,
  `results` JSON DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `featured_image` VARCHAR(191) NOT NULL,
  `hero_image` VARCHAR(191) DEFAULT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
  `is_top_work` TINYINT(1) NOT NULL DEFAULT 0,
  `display_order` INT NOT NULL DEFAULT 0,
  `story` JSON DEFAULT NULL,
  `seo_title` VARCHAR(191) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_works_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create Work Gallery table
CREATE TABLE IF NOT EXISTS `work_gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `work_id` INT NOT NULL,
  `image_url` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL DEFAULT 'image',
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_work_gallery_work` FOREIGN KEY (`work_id`) REFERENCES `works`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create Updates table
CREATE TABLE IF NOT EXISTS `updates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL DEFAULT 'General',
  `short_description` TEXT NOT NULL,
  `description` JSON NOT NULL,
  `thumbnail` VARCHAR(191) NOT NULL,
  `banner` VARCHAR(191) DEFAULT NULL,
  `author` VARCHAR(191) NOT NULL DEFAULT 'Jey Anand',
  `tags` JSON DEFAULT NULL,
  `key_takeaways` JSON DEFAULT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
  `published_date` VARCHAR(191) NOT NULL,
  `seo_title` VARCHAR(191) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Create Update Gallery table
CREATE TABLE IF NOT EXISTS `update_gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `update_id` INT NOT NULL,
  `image_url` VARCHAR(191) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_update_gallery_update` FOREIGN KEY (`update_id`) REFERENCES `updates`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Create Activity Logs table
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT DEFAULT NULL,
  `action` VARCHAR(191) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_activity_logs_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Create Services table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `price_inr` VARCHAR(191) NOT NULL,
  `price_usd` VARCHAR(191) NOT NULL,
  `notes` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Create Settings table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `key_name` VARCHAR(191) NOT NULL UNIQUE,
  `value` LONGTEXT DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Create Media table
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(191) NOT NULL,
  `original_name` VARCHAR(191) NOT NULL,
  `mime_type` VARCHAR(191) NOT NULL,
  `size` INT NOT NULL,
  `url` VARCHAR(191) NOT NULL,
  `folder` VARCHAR(191) NOT NULL DEFAULT '/',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Seed default administrator (Username: Askjey, Password: AskJey@2025)
INSERT INTO `admins` (`name`, `username`, `password`, `avatar_url`)
VALUES ('Askjey', 'Askjey', '$2a$10$2OBluoMQ2o1KhUH4oNIX7uw5tYwQPKFY/32tN/yIa6TMy.pXgU1ha', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg')
ON DUPLICATE KEY UPDATE `username`=`username`;
