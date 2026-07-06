import { FastifyReply, FastifyRequest } from 'fastify';
import { ProfileService } from './profile.service';
import { CreateProfileInput, UpdateProfileInput } from './schemas';

export class ProfileController {
  constructor(private profileService: ProfileService) {}

  async listProfiles(
    request: FastifyRequest<{ Querystring: { limit?: number; offset?: number } }>,
    reply: FastifyReply,
  ) {
    const limit = request.query.limit ? Number(request.query.limit) : undefined;
    const offset = request.query.offset ? Number(request.query.offset) : undefined;
    const result = await this.profileService.listProfiles(limit, offset);
    return reply.send({ success: true, data: result });
  }

  async getProfile(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const profile = await this.profileService.getProfile(request.params.id);
    return reply.send({ success: true, data: profile });
  }

  async createProfile(request: FastifyRequest<{ Body: CreateProfileInput }>, reply: FastifyReply) {
    const profile = await this.profileService.createProfile(request.body);
    return reply.status(201).send({ success: true, data: profile });
  }

  async updateProfile(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateProfileInput }>,
    reply: FastifyReply,
  ) {
    const profile = await this.profileService.updateProfile(request.params.id, request.body);
    return reply.send({ success: true, data: profile });
  }

  async deleteProfile(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.profileService.deleteProfile(request.params.id);
    return reply.send({ success: true, message: 'Profile deleted' });
  }
}
