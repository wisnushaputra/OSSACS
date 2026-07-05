import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { roles } from './roles';
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    fullname: varchar('fullname', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    roleId: uuid('role_id')
        .references(() => roles.id)
        .notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
