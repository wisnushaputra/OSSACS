import { FastifyReply, FastifyRequest } from 'fastify';
import { PermissionService } from './permission.service';
import { CreatePermissionInput, UpdatePermissionInput } from './permission.schema';

export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  async createPermission(
    request: FastifyRequest<{ Body: CreatePermissionInput }>,
    reply: FastifyReply,
  ) {
    const permission = await this.permissionService.createPermission(request.body);
    return reply.status(201).send(permission);
  }

  async getPermission(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const permission = await this.permissionService.getPermissionById(request.params.id);
    return reply.status(200).send(permission);
  }

  async updatePermission(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdatePermissionInput }>,
    reply: FastifyReply,
  ) {
    const permission = await this.permissionService.updatePermission(
      request.params.id,
      request.body,
    );
    if (!permission) {
      return reply.status(404).send({ message: 'Permission not found' });
    }
    return reply.status(200).send(permission);
  }

  async deletePermission(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.permissionService.deletePermission(request.params.id);
    return reply.status(204).send();
  }

  async listPermissions(request: FastifyRequest, reply: FastifyReply) {
    const permissions = await this.permissionService.listPermissions();
    return reply.status(200).send(permissions);
  }

  async assignPermissionToRole(
    request: FastifyRequest<{ Body: { roleId: string; permissionId: string } }>,
    reply: FastifyReply,
  ) {
    const { roleId, permissionId } = request.body;
    await this.permissionService.assignPermissionToRole(roleId, permissionId);
    return reply.status(200).send({ message: 'Permission assigned to role' });
  }

  async removePermissionFromRole(
    request: FastifyRequest<{ Body: { roleId: string; permissionId: string } }>,
    reply: FastifyReply,
  ) {
    const { roleId, permissionId } = request.body;
    await this.permissionService.removePermissionFromRole(roleId, permissionId);
    return reply.status(200).send({ message: 'Permission removed from role' });
  }

  async getRolePermissions(
    request: FastifyRequest<{ Params: { roleId: string } }>,
    reply: FastifyReply,
  ) {
    const permissions = await this.permissionService.getRolePermissions(request.params.roleId);
    return reply.status(200).send(permissions);
  }
}
