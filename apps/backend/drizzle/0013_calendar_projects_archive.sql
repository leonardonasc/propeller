ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "archived_at" timestamp;
CREATE TABLE IF NOT EXISTS "calendar_events" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text,
  "starts_at" timestamp NOT NULL,
  "ends_at" timestamp NOT NULL,
  "all_day" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "calendar_events_user_starts_idx" ON "calendar_events" USING btree ("user_id", "starts_at");
