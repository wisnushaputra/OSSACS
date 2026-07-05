import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { userSchemas, } from './user.schema';
export async function userRoutes(server) {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    server.get('/', {
        preHandler: [server.authenticate],
        schema: {
            response: { 200: userSchemas.usersResponseSchema },
        },
    }, userController.listUsers.bind(userController));
    server.post('/', {
        preHandler: [server.authenticate],
        schema: {
            body: userSchemas.createUserSchema,
            response: { 201: userSchemas.userResponseSchema },
        },
    }, userController.createUser.bind(userController));
    server.get('/:id', {
        preHandler: [server.authenticate],
        schema: {
            response: { 200: userSchemas.userResponseSchema },
        },
    }, userController.getUser.bind(userController));
    server.put('/:id', {
        preHandler: [server.authenticate],
        schema: {
            body: userSchemas.updateUserSchema,
            response: { 200: userSchemas.userResponseSchema },
        },
    }, userController.updateUser.bind(userController));
    server.delete('/:id', {
        preHandler: [server.authenticate],
        schema: {
            response: { 204: {} },
        },
    }, userController.deleteUser.bind(userController));
}
