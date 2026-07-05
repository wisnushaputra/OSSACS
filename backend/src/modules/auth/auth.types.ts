import { users, roles, permissions } from '../../db/schema';

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type NewRole = typeof roles.$inferInsert;
export type Role = typeof roles.$inferSelect;

export type NewPermission = typeof permissions.$inferInsert;
export type Permission = typeof permissions.$inferSelect;
