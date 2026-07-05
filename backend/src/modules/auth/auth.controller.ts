import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LoginInput, RefreshInput, ChangePasswordInput, ResetPasswordInput } from './auth.schema';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    const result = await this.authService.login(request.body, ipAddress, userAgent);
    return reply.status(200).send(result);
  }

  async refreshToken(request: FastifyRequest<{ Body: RefreshInput }>, reply: FastifyReply) {
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    const result = await this.authService.refreshToken(request.body, ipAddress, userAgent);
    return reply.status(200).send(result);
  }

  async logout(request: FastifyRequest<{ Body: RefreshInput }>, reply: FastifyReply) {
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];
    const userId = (request.user as any)?.id; // Requires JWT middleware to be active

    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    await this.authService.logout(request.body.refreshToken, userId, ipAddress, userAgent);
    return reply.status(200).send({ success: true, message: 'Logged out successfully' });
  }

  async getMe(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id;

    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    const user = await this.authService.getMe(userId);
    return reply.status(200).send(user);
  }

  async changePassword(request: FastifyRequest<{ Body: ChangePasswordInput }>, reply: FastifyReply) {
    const userId = (request.user as any)?.id;
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    if (!userId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    await this.authService.changePassword(userId, request.body, ipAddress, userAgent);
    return reply.status(200).send({ success: true, message: 'Password changed successfully' });
  }

  async resetPassword(request: FastifyRequest<{ Params: { id: string }; Body: ResetPasswordInput }>, reply: FastifyReply) {
    const adminUserId = (request.user as any)?.id; // Requires JWT middleware
    const targetUserId = request.params.id;
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    if (!adminUserId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    await this.authService.resetPassword(adminUserId, targetUserId, request.body, ipAddress, userAgent);
    return reply.status(200).send({ success: true, message: 'Password reset successfully' });
  }

  async revokeUserSessions(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const adminUserId = (request.user as any)?.id;
    const targetUserId = request.params.id;
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    if (!adminUserId) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }

    await this.authService.revokeAllUserSessions(adminUserId, targetUserId, ipAddress, userAgent);
    return reply.status(200).send({ success: true, message: 'All sessions revoked successfully' });
  }
}
