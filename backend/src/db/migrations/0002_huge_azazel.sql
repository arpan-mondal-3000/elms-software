ALTER TABLE "user_records" DROP CONSTRAINT "user_records_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_records" ADD CONSTRAINT "user_records_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;