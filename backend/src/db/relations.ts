import { relations } from 'drizzle-orm';
import { users, roles, permissions, rolePermissions, refreshTokens, auditLogs, olts, ponPorts, onus, pops, workflows, workflowSteps } from './schema';

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

export const oltsRelations = relations(olts, ({ one, many }) => ({
  pop: one(pops, {
    fields: [olts.popId],
    references: [pops.id],
  }),
  ponPorts: many(ponPorts),
  onus: many(onus),
}));

export const ponPortsRelations = relations(ponPorts, ({ one }) => ({
  olt: one(olts, {
    fields: [ponPorts.oltId],
    references: [olts.id],
  }),
}));

export const onusRelations = relations(onus, ({ one }) => ({
  olt: one(olts, {
    fields: [onus.oltId],
    references: [olts.id],
  }),
  // We can also add ponPort relation later if onus schema gets a ponPortId
}));

// Workflow relations
export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  user: one(users, {
    fields: [workflows.triggeredBy],
    references: [users.id],
  }),
  onu: one(onus, {
    fields: [workflows.onuId],
    references: [onus.id],
  }),
  steps: many(workflowSteps),
}));

// WorkflowStep relations
export const workflowStepsRelations = relations(workflowSteps, ({ one }) => ({
  workflow: one(workflows, {
    fields: [workflowSteps.workflowId],
    references: [workflows.id],
  }),
}));
