/*
  Warnings:

  - You are about to drop the column `user_id` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "public"."User";
