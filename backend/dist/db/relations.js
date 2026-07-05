import { relations } from 'drizzle-orm';
import { users, roles, permissions, rolePermissions, refreshTokens, auditLogs } from './schema';
// User relations
export const usersRelations = relations(users, ({ one, many }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
    refreshTokens: many(refreshTokens),
    auditLogs: many(auditLogs),
}));
// Role relations
export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
    permissions: many(rolePermissions),
}));
// Permission relations
export const permissionsRelations = relations(permissions, ({ many }) => ({
    roles: many(rolePermissions),
}));
// RolePermission relations
export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id],
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permissionId],
        references: [permissions.id],
    }),
}));
// RefreshToken relations
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}));
// AuditLog relations
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id],
    }),
}));
