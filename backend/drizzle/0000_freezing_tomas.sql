CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(255) NOT NULL,
	"entity" varchar(255),
	"entity_id" uuid,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_code" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"phone" varchar(50),
	"address" text,
	"email" varchar(255),
	"status" varchar(50) DEFAULT 'Active' NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_customer_code_unique" UNIQUE("customer_code")
);
--> statement-breakpoint
CREATE TABLE "device_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"onu_id" uuid NOT NULL,
	"event_type" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "device_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"onu_id" uuid NOT NULL,
	"status" varchar(50) NOT NULL,
	"rx_power" numeric,
	"tx_power" numeric,
	"uptime" bigint,
	"ip_address" varchar(45),
	"last_inform" timestamp,
	"last_contact" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"fullname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "olts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"vendor" varchar(255) NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"location" varchar(255),
	"description" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"olt_id" uuid NOT NULL,
	"serial_number" varchar(255) NOT NULL,
	"genie_device_id" varchar(255) NOT NULL,
	"pon_port" varchar(255) NOT NULL,
	"onu_id" integer NOT NULL,
	"profile_name" varchar(255) NOT NULL,
	"vlan" integer NOT NULL,
	"firmware" varchar(255),
	"model" varchar(255),
	"manufacturer" varchar(255),
	"deleted_at" timestamp,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "onus_serial_number_unique" UNIQUE("serial_number"),
	CONSTRAINT "onus_genie_device_id_unique" UNIQUE("genie_device_id")
);
--> statement-breakpoint
CREATE TABLE "pppoe_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"onu_id" uuid NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"service_vlan" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wifi_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"onu_id" uuid NOT NULL,
	"ssid" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"encryption" varchar(50),
	"channel" integer,
	"bandwidth" varchar(50),
	"hidden" boolean DEFAULT false,
	"guest_enabled" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provision_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"onu_id" uuid NOT NULL,
	"task_type" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'WAITING' NOT NULL,
	"progress" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"message" text
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"level" varchar(50) DEFAULT 'INFO' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text,
	"description" text,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_events" ADD CONSTRAINT "device_events_onu_id_onus_id_fk" FOREIGN KEY ("onu_id") REFERENCES "public"."onus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_status" ADD CONSTRAINT "device_status_onu_id_onus_id_fk" FOREIGN KEY ("onu_id") REFERENCES "public"."onus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onus" ADD CONSTRAINT "onus_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onus" ADD CONSTRAINT "onus_olt_id_olts_id_fk" FOREIGN KEY ("olt_id") REFERENCES "public"."olts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pppoe_profiles" ADD CONSTRAINT "pppoe_profiles_onu_id_onus_id_fk" FOREIGN KEY ("onu_id") REFERENCES "public"."onus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wifi_profiles" ADD CONSTRAINT "wifi_profiles_onu_id_onus_id_fk" FOREIGN KEY ("onu_id") REFERENCES "public"."onus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provision_tasks" ADD CONSTRAINT "provision_tasks_onu_id_onus_id_fk" FOREIGN KEY ("onu_id") REFERENCES "public"."onus"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;