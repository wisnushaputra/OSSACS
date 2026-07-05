import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import {
  authSchemas,
  LoginInput,
  RefreshInput,
  ChangePasswordInput,
  ResetPasswordInput,
} from './auth.schema';
import { z } from 'zod';

export async function authRoutes(server: FastifyInstance) {
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository, server);
  const authController = new AuthController(authService);

  server.post<{ Body: LoginInput; Reply: typeof authSchemas.loginResponseSchema }>(
    '/login',
    {
      schema: {
        body: authSchemas.loginSchema,
        response: { 200: authSchemas.loginResponseSchema },
      },
    },
    authController.login.bind(authController),
  );

  server.post<{ Body: RefreshInput; Reply: typeof authSchemas.refreshResponseSchema }>(
    '/refresh',
    {
      schema: {
        body: authSchemas.refreshSchema,
        response: { 200: authSchemas.refreshResponseSchema },
      },
    },
    authController.refreshToken.bind(authController),
  );

  server.post<{ Body: RefreshInput }>(
    '/logout',
    {
      schema: {
        body: authSchemas.refreshSchema,
      },
    },
    authController.logout.bind(authController),
  );

  server.get<{ Reply: typeof authSchemas.userMeResponseSchema }>(
    '/me',
    {
      preHandler: server.authenticate,
      schema: {
        response: { 200: authSchemas.userMeResponseSchema },
      },
    },
    authController.getMe.bind(authController),
  );

  server.post<{ Body: ChangePasswordInput; Reply: { success: boolean; message: string } }>(
    '/me/change-password',
    {
      preHandler: server.authenticate,
      schema: {
        body: authSchemas.changePasswordSchema,
        response: { 200: z.object({ success: z.boolean(), message: z.string() }) },
      },
    },
    authController.changePassword.bind(authController),
  );

  server.post<{
    Params: { id: string };
    Body: ResetPasswordInput;
    Reply: { success: boolean; message: string };
  }>(
    '/users/:id/reset-password',
    {
      preHandler: server.authenticate,
      schema: {
        body: authSchemas.resetPasswordSchema,
        response: { 200: z.object({ success: z.boolean(), message: z.string() }) },
      },
    },
    authController.resetPassword.bind(authController),
  );

  server.post<{ Params: { id: string }; Reply: { success: boolean; message: string } }>(
    '/users/:id/revoke-sessions',
    {
      preHandler: server.authenticate,
      schema: {
        response: { 200: z.object({ success: z.boolean(), message: z.string() }) },
      },
    },
    authController.revokeUserSessions.bind(authController),
  );
}
