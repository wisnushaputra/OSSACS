CREATE TABLE IF NOT EXISTS "regions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) NOT NULL UNIQUE,
  "description" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "pops" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) NOT NULL UNIQUE,
  "region_id" uuid NOT NULL REFERENCES "regions"("id") ON DELETE RESTRICT,
  "description" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

ALTER TABLE "olts"
  DROP COLUMN IF EXISTS "region",
  DROP COLUMN IF EXISTS "pop",
  ADD COLUMN "pop_id" uuid REFERENCES "pops"("id") ON DELETE RESTRICT;
