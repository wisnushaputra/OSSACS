export class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async listProfiles(request, reply) {
        const limit = request.query.limit ? Number(request.query.limit) : undefined;
        const offset = request.query.offset ? Number(request.query.offset) : undefined;
        const result = await this.profileService.listProfiles(limit, offset);
        return reply.send({ success: true, data: result });
    }
    async getProfile(request, reply) {
        const profile = await this.profileService.getProfile(request.params.id);
        return reply.send({ success: true, data: profile });
    }
    async createProfile(request, reply) {
        const profile = await this.profileService.createProfile(request.body);
        return reply.status(201).send({ success: true, data: profile });
    }
    async updateProfile(request, reply) {
        const profile = await this.profileService.updateProfile(request.params.id, request.body);
        return reply.send({ success: true, data: profile });
    }
    async deleteProfile(request, reply) {
        await this.profileService.deleteProfile(request.params.id);
        return reply.send({ success: true, message: 'Profile deleted' });
    }
}
