import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
export const customers = pgTable('customers', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerCode: varchar('customer_code', { length: 255 }).notNull().unique(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    address: text('address'),
    email: varchar('email', { length: 255 }),
    status: varchar('status', { length: 50 }).default('Active').notNull(), // Active, Suspended, Inactive
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        customerCodeIdx: index('customer_code_idx').on(table.customerCode),
        fullNameIdx: index('full_name_idx').on(table.fullName),
    };
});
