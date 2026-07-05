import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './user.schema';

export class UserController {
  constructor(private userService: UserService) {}

  async listUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.listUsers();
    return reply.status(200).send(users);
  }

  async createUser(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    const user = await this.userService.createUser(request.body);
    return reply.status(201).send(user);
  }

  async getUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const user = await this.userService.getUserById(request.params.id);
    return reply.status(200).send(user);
  }

  async updateUser(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserInput }>,
    reply: FastifyReply
  ) {
    const user = await this.userService.updateUser(request.params.id, request.body);
    return reply.status(200).send(user);
  }

  async deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.userService.deleteUser(request.params.id);
    return reply.status(204).send();
  }
}