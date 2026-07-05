import { FastifyReply, FastifyRequest } from 'fastify';
import { RoleService } from './role.service';
import { CreateRoleInput, UpdateRoleInput } from './role.schema';

export class RoleController {
  constructor(private roleService: RoleService) {}

  async createRole(request: FastifyRequest<{ Body: CreateRoleInput }>, reply: FastifyReply) {
    const role = await this.roleService.createRole(request.body);
    return reply.status(201).send(role);
  }

  async getRole(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const role = await this.roleService.getRoleById(request.params.id);
    return reply.status(200).send(role);
  }

  async updateRole(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateRoleInput }>,
    reply: FastifyReply,
  ) {
    const role = await this.roleService.updateRole(request.params.id, request.body);
    return reply.status(200).send(role);
  }

  async deleteRole(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.roleService.deleteRole(request.params.id);
    return reply.status(204).send();
  }

  async listRoles(request: FastifyRequest, reply: FastifyReply) {
    const roles = await this.roleService.listRoles();
    return reply.status(200).send(roles);
  }
}
