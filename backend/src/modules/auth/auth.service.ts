import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { FastifyInstance } from 'fastify';
import { eq, and } from 'drizzle-orm';
import { config } from '../../config';
import { db } from '../../db';
import { refreshTokens, auditLogs, users } from '../../db/schema';
import { NotFoundError, UnauthorizedError } from '../../lib/errors';
import { ChangePasswordInput, LoginInput, RefreshInput, ResetPasswordInput } from './auth.schema';
import { UserRepository } from './user.repository';
import type { UserPayload } from '../../middleware/jwt.middleware';

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private server: FastifyInstance,
  ) {}

  async login(input: LoginInput, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepository.findByUsername(input.username);

    if (!user || !user.isActive) {
      this.logAudit(user?.id, 'FAILED_LOGIN', 'User not found or inactive', ipAddress, userAgent);
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordMatch) {
      this.logAudit(user.id, 'FAILED_LOGIN', 'Invalid password', ipAddress, userAgent);
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: UserPayload = { id: user.id, username: user.username, roleId: user.roleId };
    const accessToken = this.server.jwt.sign(payload, { expiresIn: config.jwtExpiresIn });

    // Generate Refresh Token (Opaque Token)
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    // 7 days expiration for refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store Refresh Token Hash in DB
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshTokenHash,
      expiresAt,
    });

    this.logAudit(user.id, 'LOGIN', 'User logged in successfully', ipAddress, userAgent);

    return {
      accessToken,
      refreshToken: rawRefreshToken, // Send raw token to client
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        roleId: user.roleId,
      },
    };
  }

  async refreshToken(input: RefreshInput, ipAddress?: string, userAgent?: string) {
    const refreshTokenHash = crypto.createHash('sha256').update(input.refreshToken).digest('hex');

    const tokenRecord = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, refreshTokenHash),
      with: {
        user: true,
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (tokenRecord.revoked) {
      this.logAudit(
        tokenRecord.userId,
        'FAILED_REFRESH',
        'Attempt to use revoked token',
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedError('Token has been revoked');
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      this.logAudit(
        tokenRecord.userId,
        'FAILED_REFRESH',
        'Attempt to use expired token',
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedError('Token has expired');
    }

    const user = tokenRecord.user;

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Generate new Access Token
    const payload: UserPayload = { id: user.id, username: user.username, roleId: user.roleId };
    const accessToken = this.server.jwt.sign(payload, { expiresIn: config.jwtExpiresIn });

    // Generate new Refresh Token (Rotation)
    const rawNewRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = crypto
      .createHash('sha256')
      .update(rawNewRefreshToken)
      .digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Transaction to revoke old token and insert new one
    await db.transaction(async (tx) => {
      await tx
        .update(refreshTokens)
        .set({ revoked: true })
        .where(eq(refreshTokens.id, tokenRecord.id));

      await tx.insert(refreshTokens).values({
        userId: user.id,
        token: newRefreshTokenHash,
        expiresAt,
      });
    });

    this.logAudit(user.id, 'REFRESH_TOKEN', 'Token refreshed successfully', ipAddress, userAgent);

    return {
      accessToken,
      refreshToken: rawNewRefreshToken,
    };
  }

  async logout(refreshToken: string, userId: string, ipAddress?: string, userAgent?: string) {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await db
      .update(refreshTokens)
      .set({ revoked: true })
      .where(and(eq(refreshTokens.token, refreshTokenHash), eq(refreshTokens.userId, userId)));

    this.logAudit(userId, 'LOGOUT', 'User logged out', ipAddress, userAgent);
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return user;
  }

  async changePassword(
    userId: string,
    input: ChangePasswordInput,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      this.logAudit(userId, 'CHANGE_PASSWORD_FAILED', 'User not found', ipAddress, userAgent);
      throw new UnauthorizedError('User not found');
    }

    const isOldPasswordMatch = await bcrypt.compare(input.oldPassword, user.passwordHash);
    if (!isOldPasswordMatch) {
      this.logAudit(userId, 'CHANGE_PASSWORD_FAILED', 'Invalid old password', ipAddress, userAgent);
      throw new UnauthorizedError('Invalid old password');
    }

    const newPasswordHash = await bcrypt.hash(input.newPassword, 10);
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, userId));

    this.logAudit(
      userId,
      'CHANGE_PASSWORD_SUCCESS',
      'User changed password successfully',
      ipAddress,
      userAgent,
    );
    return { success: true, message: 'Password changed successfully' };
  }

  async resetPassword(
    adminUserId: string,
    targetUserId: string,
    input: ResetPasswordInput,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Basic authorization check (more robust RBAC to be implemented with JWT middleware)
    // For now, assume a preHandler will ensure adminUserId has permission

    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      this.logAudit(
        adminUserId,
        'RESET_PASSWORD_FAILED',
        `Attempt to reset non-existent user ${targetUserId}`,
        ipAddress,
        userAgent,
      );
      throw new NotFoundError('Target User');
    }

    const newPasswordHash = await bcrypt.hash(input.newPassword, 10);
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, targetUserId));

    this.logAudit(
      adminUserId,
      'RESET_PASSWORD_SUCCESS',
      `Admin ${adminUserId} reset password for user ${targetUserId}`,
      ipAddress,
      userAgent,
    );
    return { success: true, message: 'Password reset successfully' };
  }

  async revokeAllUserSessions(
    adminUserId: string,
    targetUserId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    // Basic authorization check (RBAC middleware handles this in real flow)

    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      this.logAudit(
        adminUserId,
        'REVOKE_SESSIONS_FAILED',
        `Attempt to revoke sessions for non-existent user ${targetUserId}`,
        ipAddress,
        userAgent,
      );
      throw new NotFoundError('Target User');
    }

    // Revoke all refresh tokens for the user
    await db
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.userId, targetUserId));

    this.logAudit(
      adminUserId,
      'REVOKE_SESSIONS_SUCCESS',
      `Admin ${adminUserId} revoked all sessions for user ${targetUserId}`,
      ipAddress,
      userAgent,
    );
    return { success: true, message: 'All sessions revoked successfully' };
  }
  // Fire and forget audit logging
  private logAudit(
    userId: string | undefined,
    action: string,
    description: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    db.insert(auditLogs)
      .values({
        userId: userId || null,
        action,
        entity: 'Authentication',
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
      })
      .catch(console.error);
  }
}
