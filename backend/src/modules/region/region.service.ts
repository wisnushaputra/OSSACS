import { RegionRepository } from './region.repository';
import { CreateRegionInput, UpdateRegionInput } from './schemas';
import { NotFoundError } from '../../lib/errors';

export class RegionService {
  constructor(private regionRepository: RegionRepository) {}

  async getRegion(id: string) {
    const region = await this.regionRepository.findById(id);
    if (!region) throw new NotFoundError('Region');
    return region;
  }

  async listRegions(limit = 10, offset = 0) {
    return this.regionRepository.list(limit, offset);
  }

  async createRegion(data: CreateRegionInput) {
    return this.regionRepository.create(data);
  }

  async updateRegion(id: string, data: UpdateRegionInput) {
    const updated = await this.regionRepository.update(id, data);
    if (!updated) throw new NotFoundError('Region');
    return updated;
  }

  async deleteRegion(id: string) {
    const deleted = await this.regionRepository.delete(id);
    if (!deleted) throw new NotFoundError('Region');
    return deleted;
  }
}
