ALTER TABLE "olts" ADD CONSTRAINT "olts_name_unique" UNIQUE ("name");
CREATE UNIQUE INDEX "olts_ip_port_unique" ON "olts" ("ip_address", "port");