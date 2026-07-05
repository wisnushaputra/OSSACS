import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { permissions } from './permissions';

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .references(() => roles.id)
      .notNull(),
    permissionId: uuid('permission_id')
      .references(() => permissions.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
    };
  },
);
