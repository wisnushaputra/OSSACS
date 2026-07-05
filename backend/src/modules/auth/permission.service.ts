import { PermissionRepository } from './permission.repository';
import { NewPermission } from './auth.types';
import { NotFoundError } from '../../lib/errors';

export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  async getPermissionById(id: string) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundError('Permission');
    }
    return permission;
  }

  async getPermissionByName(name: string) {
    const permission = await this.permissionRepository.findByName(name);
    if (!permission) {
      throw new NotFoundError('Permission');
    }
    return permission;
  }

  async createPermission(permissionData: NewPermission) {
    return this.permissionRepository.create(permissionData);
  }

  async updatePermission(id: string, permissionData: Partial<NewPermission>) {
    const permission = await this.permissionRepository.update(id, permissionData);
    if (!permission) {
      throw new NotFoundError('Permission');
    }
    return permission;
  }

  async deletePermission(id: string) {
    const permission = await this.permissionRepository.delete(id);
    if (!permission) {
      throw new NotFoundError('Permission');
    }
    return permission;
  }

  async listPermissions() {
    return this.permissionRepository.list();
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    await this.permissionRepository.assignPermissionToRole(roleId, permissionId);
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    await this.permissionRepository.removePermissionFromRole(roleId, permissionId);
  }

  async getRolePermissions(roleId: string) {
    return this.permissionRepository.getRolePermissions(roleId);
  }
}
