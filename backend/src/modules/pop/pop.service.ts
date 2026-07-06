import { PopRepository } from './pop.repository';
import { CreatePopInput, UpdatePopInput } from './schemas';
import { NotFoundError } from '../../lib/errors';

export class PopService {
  constructor(private popRepository: PopRepository) {}

  async getPop(id: string) {
    const pop = await this.popRepository.findById(id);
    if (!pop) throw new NotFoundError('Pop');
    return pop;
  }

  async listPops(limit = 10, offset = 0) {
    return this.popRepository.list(limit, offset);
  }

  async createPop(data: CreatePopInput) {
    return this.popRepository.create(data);
  }

  async updatePop(id: string, data: UpdatePopInput) {
    const updated = await this.popRepository.update(id, data);
    if (!updated) throw new NotFoundError('Pop');
    return updated;
  }

  async deletePop(id: string) {
    const deleted = await this.popRepository.delete(id);
    if (!deleted) throw new NotFoundError('Pop');
    return deleted;
  }
}
