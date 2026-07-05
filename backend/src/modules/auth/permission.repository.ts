import { db } from '../../db';
import { permissions, rolePermissions } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { NewPermission } from './auth.types';

export class PermissionRepository {
  async findById(id: string) {
    return db.query.permissions.findFirst({
      where: eq(permissions.id, id),
    });
  }

  async findByName(name: string) {
    return db.query.permissions.findFirst({
      where: eq(permissions.name, name),
    });
  }

  async create(permissionData: NewPermission) {
    const [newPermission] = await db.insert(permissions).values(permissionData).returning();
    return newPermission;
  }

  async update(id: string, permissionData: Partial<NewPermission>) {
    const [updatedPermission] = await db.update(permissions).set(permissionData).where(eq(permissions.id, id)).returning();
    return updatedPermission;
  }

  async delete(id: string) {
    const [deletedPermission] = await db.delete(permissions).where(eq(permissions.id, id)).returning();
    return deletedPermission;
  }

  async list() {
    return db.query.permissions.findMany();
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    await db.insert(rolePermissions).values({ roleId, permissionId });
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    await db.delete(rolePermissions).where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId)));
  }

  async getRolePermissions(roleId: string) {
    return db.query.rolePermissions.findMany({
      where: eq(rolePermissions.roleId, roleId),
      with: {
        permission: true,
      },
    });
  }
}
