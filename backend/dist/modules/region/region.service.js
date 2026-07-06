import { NotFoundError } from '../../lib/errors';
export class RegionService {
    regionRepository;
    constructor(regionRepository) {
        this.regionRepository = regionRepository;
    }
    async getRegion(id) {
        const region = await this.regionRepository.findById(id);
        if (!region)
            throw new NotFoundError('Region');
        return region;
    }
    async listRegions(limit = 10, offset = 0) {
        return this.regionRepository.list(limit, offset);
    }
    async createRegion(data) {
        return this.regionRepository.create(data);
    }
    async updateRegion(id, data) {
        const updated = await this.regionRepository.update(id, data);
        if (!updated)
            throw new NotFoundError('Region');
        return updated;
    }
    async deleteRegion(id) {
        const deleted = await this.regionRepository.delete(id);
        if (!deleted)
            throw new NotFoundError('Region');
        return deleted;
    }
}
