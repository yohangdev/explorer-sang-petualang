CREATE TABLE "directories" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parent_id" uuid,
	"name" varchar NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY NOT NULL,
	"directory_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"size_bytes" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"extension" varchar NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "directories" ADD CONSTRAINT "directories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."directories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "directories_id_fkey" FOREIGN KEY ("directory_id") REFERENCES "public"."directories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "directories_parent_id_idx" ON "directories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "directories_id_idx" ON "files" USING btree ("directory_id");