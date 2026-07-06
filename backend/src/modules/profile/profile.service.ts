import { ProfileRepository } from './profile.repository';
import { CreateProfileInput, UpdateProfileInput } from './schemas';
import { NotFoundError } from '../../lib/errors';

export class ProfileService {
  constructor(private profileRepository: ProfileRepository) {}

  async getProfile(id: string) {
    const profile = await this.profileRepository.findById(id);
    if (!profile) throw new NotFoundError('Profile');
    return profile;
  }

  async listProfiles(limit = 10, offset = 0) {
    return this.profileRepository.list(limit, offset);
  }

  async createProfile(data: CreateProfileInput) {
    return this.profileRepository.create(data);
  }

  async updateProfile(id: string, data: UpdateProfileInput) {
    const updated = await this.profileRepository.update(id, data);
    if (!updated) throw new NotFoundError('Profile');
    return updated;
  }

  async deleteProfile(id: string) {
    const deleted = await this.profileRepository.delete(id);
    if (!deleted) throw new NotFoundError('Profile');
    return deleted;
  }
}
