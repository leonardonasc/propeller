SET LOCAL lock_timeout = '5s';--> statement-breakpoint
CREATE SEQUENCE IF NOT EXISTS "user_username_seq";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "username" text;--> statement-breakpoint
UPDATE "user" SET "username" = 'user' || nextval('"user_username_seq"')::text WHERE "username" IS NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT ('user' || nextval('"user_username_seq"')::text);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_username_unique" ON "user" ("username");--> statement-breakpoint
ALTER TABLE "calendar_events" ALTER COLUMN "ends_at" DROP NOT NULL;--> statement-breakpoint
