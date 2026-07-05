CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "customer_code_idx" ON "customers" USING btree ("customer_code");--> statement-breakpoint
CREATE INDEX "full_name_idx" ON "customers" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "device_events_onu_id_idx" ON "device_events" USING btree ("onu_id");--> statement-breakpoint
CREATE INDEX "device_events_event_type_idx" ON "device_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "device_events_created_at_idx" ON "device_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "device_status_onu_id_idx" ON "device_status" USING btree ("onu_id");--> statement-breakpoint
CREATE INDEX "device_status_status_idx" ON "device_status" USING btree ("status");--> statement-breakpoint
CREATE INDEX "serial_number_idx" ON "onus" USING btree ("serial_number");--> statement-breakpoint
CREATE INDEX "genie_device_id_idx" ON "onus" USING btree ("genie_device_id");--> statement-breakpoint
CREATE INDEX "olt_id_idx" ON "onus" USING btree ("olt_id");--> statement-breakpoint
CREATE INDEX "customer_id_idx" ON "onus" USING btree ("customer_id");