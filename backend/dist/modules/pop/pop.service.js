import { NotFoundError } from '../../lib/errors';
export class PopService {
    popRepository;
    constructor(popRepository) {
        this.popRepository = popRepository;
    }
    async getPop(id) {
        const pop = await this.popRepository.findById(id);
        if (!pop)
            throw new NotFoundError('Pop');
        return pop;
    }
    async listPops(limit = 10, offset = 0) {
        return this.popRepository.list(limit, offset);
    }
    async createPop(data) {
        return this.popRepository.create(data);
    }
    async updatePop(id, data) {
        const updated = await this.popRepository.update(id, data);
        if (!updated)
            throw new NotFoundError('Pop');
        return updated;
    }
    async deletePop(id) {
        const deleted = await this.popRepository.delete(id);
        if (!deleted)
            throw new NotFoundError('Pop');
        return deleted;
    }
}
