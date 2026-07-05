export class PermissionController {
    permissionService;
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    async createPermission(request, reply) {
        const permission = await this.permissionService.createPermission(request.body);
        return reply.status(201).send(permission);
    }
    async getPermission(request, reply) {
        const permission = await this.permissionService.getPermissionById(request.params.id);
        return reply.status(200).send(permission);
    }
    async updatePermission(request, reply) {
        const permission = await this.permissionService.updatePermission(request.params.id, request.body);
        if (!permission) {
            return reply.status(404).send({ message: 'Permission not found' });
        }
        return reply.status(200).send(permission);
    }
    async deletePermission(request, reply) {
        await this.permissionService.deletePermission(request.params.id);
        return reply.status(204).send();
    }
    async listPermissions(request, reply) {
        const permissions = await this.permissionService.listPermissions();
        return reply.status(200).send(permissions);
    }
    async assignPermissionToRole(request, reply) {
        const { roleId, permissionId } = request.body;
        await this.permissionService.assignPermissionToRole(roleId, permissionId);
        return reply.status(200).send({ message: 'Permission assigned to role' });
    }
    async removePermissionFromRole(request, reply) {
        const { roleId, permissionId } = request.body;
        await this.permissionService.removePermissionFromRole(roleId, permissionId);
        return reply.status(200).send({ message: 'Permission removed from role' });
    }
    async getRolePermissions(request, reply) {
        const permissions = await this.permissionService.getRolePermissions(request.params.roleId);
        return reply.status(200).send(permissions);
    }
}
