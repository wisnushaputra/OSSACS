import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';
import { authSchemas, } from './auth.schema';
import { z } from 'zod';
export async function authRoutes(server) {
    const userRepository = new UserRepository();
    const authService = new AuthService(userRepository, server);
    const authController = new AuthController(authService);
    server.post('/login', {
        schema: {
            body: authSchemas.loginSchema,
            response: { 200: authSchemas.loginResponseSchema },
        },
    }, authController.login.bind(authController));
    server.post('/refresh', {
        schema: {
            body: authSchemas.refreshSchema,
            response: { 200: authSchemas.refreshResponseSchema },
        },
    }, authController.refreshToken.bind(authController));
    server.post('/logout', {
        schema: {
            body: authSchemas.refreshSchema,
        },
    }, authController.logout.bind(authController));
    server.get('/me', {
        preHandler: server.authenticate,
        schema: {
            response: { 200: authSchemas.userMeResponseSchema },
        },
    }, authController.getMe.bind(authController));
    server.post('/me/change-password', {
        preHandler: server.authenticate,
        schema: {
            body: authSchemas.changePasswordSchema,
            response: { 200: z.object({ success: z.boolean(), message: z.string() }) },
        },
    }, authController.changePassword.bind(authController));
    server.post('/users/:id/reset-password', {
        preHandler: server.authenticate,
        schema: {
            body: authSchemas.resetPasswordSchema,
            response: { 200: z.object({ success: z.boolean(), message: z.string() }) },
        },
    }, authController.resetPassword.bind(authController));
    server.post('/users/:id/revoke-sessions', {
        preHandler: server.authenticate,
        schema: {
            response: { 200: z.object({ success: z.boolean(), message: z.string() }) },
        },
    }, authController.revokeUserSessions.bind(authController));
}
