CREATE TYPE "public"."genders" AS ENUM('male', 'female');--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "gender" "genders";--> statement-breakpoint
ALTER TABLE "employees" ADD COLUMN "position" text;