export class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    async createRole(request, reply) {
        const role = await this.roleService.createRole(request.body);
        return reply.status(201).send(role);
    }
    async getRole(request, reply) {
        const role = await this.roleService.getRoleById(request.params.id);
        return reply.status(200).send(role);
    }
    async updateRole(request, reply) {
        const role = await this.roleService.updateRole(request.params.id, request.body);
        return reply.status(200).send(role);
    }
    async deleteRole(request, reply) {
        await this.roleService.deleteRole(request.params.id);
        return reply.status(204).send();
    }
    async listRoles(request, reply) {
        const roles = await this.roleService.listRoles();
        return reply.status(200).send(roles);
    }
}
