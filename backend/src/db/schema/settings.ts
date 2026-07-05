import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';

export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
});
