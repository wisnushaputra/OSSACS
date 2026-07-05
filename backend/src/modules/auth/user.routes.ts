import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import {
  userSchemas,
  CreateUserInput,
  UpdateUserInput,
} from './user.schema';

export async function userRoutes(server: FastifyInstance) {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  server.get<{ Reply: typeof userSchemas.usersResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        response: { 200: userSchemas.usersResponseSchema },
      },
    },
    userController.listUsers.bind(userController)
  );

  server.post<{ Body: CreateUserInput; Reply: typeof userSchemas.userResponseSchema }>(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        body: userSchemas.createUserSchema,
        response: { 201: userSchemas.userResponseSchema },
      },
    },
    userController.createUser.bind(userController)
  );

  server.get<{ Params: { id: string }; Reply: typeof userSchemas.userResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate],
      schema: {
        response: { 200: userSchemas.userResponseSchema },
      },
    },
    userController.getUser.bind(userController)
  );

  server.put<{ Params: { id: string }; Body: UpdateUserInput; Reply: typeof userSchemas.userResponseSchema }>(
    '/:id',
    {
      preHandler: [server.authenticate],
      schema: {
        body: userSchemas.updateUserSchema,
        response: { 200: userSchemas.userResponseSchema },
      },
    },
    userController.updateUser.bind(userController)
  );

  server.delete<{ Params: { id: string }; Reply: {} }>(
    '/:id',
    {
      preHandler: [server.authenticate],
      schema: {
        response: { 204: {} },
      },
    },
    userController.deleteUser.bind(userController)
  );
}