import { NotFoundError } from '../../lib/errors';
export class PermissionService {
    permissionRepository;
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async getPermissionById(id) {
        const permission = await this.permissionRepository.findById(id);
        if (!permission) {
            throw new NotFoundError('Permission');
        }
        return permission;
    }
    async getPermissionByName(name) {
        const permission = await this.permissionRepository.findByName(name);
        if (!permission) {
            throw new NotFoundError('Permission');
        }
        return permission;
    }
    async createPermission(permissionData) {
        return this.permissionRepository.create(permissionData);
    }
    async updatePermission(id, permissionData) {
        const permission = await this.permissionRepository.update(id, permissionData);
        if (!permission) {
            throw new NotFoundError('Permission');
        }
        return permission;
    }
    async deletePermission(id) {
        const permission = await this.permissionRepository.delete(id);
        if (!permission) {
            throw new NotFoundError('Permission');
        }
        return permission;
    }
    async listPermissions() {
        return this.permissionRepository.list();
    }
    async assignPermissionToRole(roleId, permissionId) {
        await this.permissionRepository.assignPermissionToRole(roleId, permissionId);
    }
    async removePermissionFromRole(roleId, permissionId) {
        await this.permissionRepository.removePermissionFromRole(roleId, permissionId);
    }
    async getRolePermissions(roleId) {
        return this.permissionRepository.getRolePermissions(roleId);
    }
}
