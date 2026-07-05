export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async listUsers(request, reply) {
        const users = await this.userService.listUsers();
        return reply.status(200).send(users);
    }
    async createUser(request, reply) {
        const user = await this.userService.createUser(request.body);
        return reply.status(201).send(user);
    }
    async getUser(request, reply) {
        const user = await this.userService.getUserById(request.params.id);
        return reply.status(200).send(user);
    }
    async updateUser(request, reply) {
        const user = await this.userService.updateUser(request.params.id, request.body);
        return reply.status(200).send(user);
    }
    async deleteUser(request, reply) {
        await this.userService.deleteUser(request.params.id);
        return reply.status(204).send();
    }
}
