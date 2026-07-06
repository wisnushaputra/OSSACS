import { NotFoundError } from '../../lib/errors';
export class ProfileService {
    profileRepository;
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }
    async getProfile(id) {
        const profile = await this.profileRepository.findById(id);
        if (!profile)
            throw new NotFoundError('Profile');
        return profile;
    }
    async listProfiles(limit = 10, offset = 0) {
        return this.profileRepository.list(limit, offset);
    }
    async createProfile(data) {
        return this.profileRepository.create(data);
    }
    async updateProfile(id, data) {
        const updated = await this.profileRepository.update(id, data);
        if (!updated)
            throw new NotFoundError('Profile');
        return updated;
    }
    async deleteProfile(id) {
        const deleted = await this.profileRepository.delete(id);
        if (!deleted)
            throw new NotFoundError('Profile');
        return deleted;
    }
}
