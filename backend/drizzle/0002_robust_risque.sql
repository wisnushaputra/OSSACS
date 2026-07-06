CREATE TABLE "pon_ports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"olt_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"port_number" integer NOT NULL,
	"max_onu" integer DEFAULT 128 NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "model" varchar(255);--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "port" varchar(10) DEFAULT '23';--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "username" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "password_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "transport" varchar(20) DEFAULT 'telnet';--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "status" varchar(50) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "region" varchar(255);--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "pop" varchar(255);--> statement-breakpoint
ALTER TABLE "olts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pon_ports" ADD CONSTRAINT "pon_ports_olt_id_olts_id_fk" FOREIGN KEY ("olt_id") REFERENCES "public"."olts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pon_ports_olt_id_idx" ON "pon_ports" USING btree ("olt_id");