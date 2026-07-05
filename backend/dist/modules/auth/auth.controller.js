export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(request, reply) {
        const ipAddress = request.ip;
        const userAgent = request.headers['user-agent'];
        const result = await this.authService.login(request.body, ipAddress, userAgent);
        return reply.status(200).send({
            success: true,
            data: result,
        });
    }
    async refreshToken(request, reply) {
        const ipAddress = request.ip;
        const userAgent = request.headers['user-agent'];
        const result = await this.authService.refreshToken(request.body, ipAddress, userAgent);
        return reply.status(200).send({
            success: true,
            data: result,
        });
    }
    async logout(request, reply) {
        const ipAddress = request.ip;
        const userAgent = request.headers['user-agent'];
        const userId = request.user?.id; // Requires JWT middleware to be active
        if (!userId) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }
        await this.authService.logout(request.body.refreshToken, userId, ipAddress, userAgent);
        return reply.status(200).send({ success: true, message: 'Logged out successfully' });
    }
    async getMe(request, reply) {
        const userId = request.user?.id;
        if (!userId) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }
        const user = await this.authService.getMe(userId);
        return reply.status(200).send(user);
    }
    async changePassword(request, reply) {
        const userId = request.user?.id;
        const ipAddress = request.ip;
        const userAgent = request.headers['user-agent'];
        if (!userId) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }
        await this.authService.changePassword(userId, request.body, ipAddress, userAgent);
        return reply.status(200).send({ success: true, message: 'Password changed successfully' });
    }
    async resetPassword(request, reply) {
        const adminUserId = request.user?.id; // Requires JWT middleware
        const targetUserId = request.params.id;
        const ipAddress = request.ip;
        const userAgent = request.headers['user-agent'];
        if (!adminUserId) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }
        await this.authService.resetPassword(adminUserId, targetUserId, request.body, ipAddress, userAgent);
        return reply.status(200).send({ success: true, message: 'Password reset successfully' });
    }
    async revokeUserSessions(request, reply) {
        const adminUserId = request.user?.id;
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
