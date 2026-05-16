/*
  Warnings:

  - You are about to drop the column `backLanguage` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `frontLanguage` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `isKnown` on the `UserQuizProgress` table. All the data in the column will be lost.
  - Added the required column `backLanguage` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frontLanguage` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Flashcard` DROP COLUMN `backLanguage`,
    DROP COLUMN `frontLanguage`;

-- AlterTable
ALTER TABLE `Quiz` ADD COLUMN `backLanguage` VARCHAR(191) NOT NULL,
    ADD COLUMN `frontLanguage` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `UserQuizProgress` DROP COLUMN `isKnown`;
