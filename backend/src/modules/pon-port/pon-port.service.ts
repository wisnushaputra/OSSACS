import { PonPortRepository } from './pon-port.repository';
import { UpdatePonPortInput } from './pon-port.schema';
import { NotFoundError } from '../../lib/errors';

export class PonPortService {
  constructor(private ponPortRepository: PonPortRepository) {}

  async getPonPort(id: string) {
    const port = await this.ponPortRepository.findById(id);
    if (!port) {
      throw new NotFoundError('PON Port');
    }
    return port;
  }

  async listPonPortsByOlt(oltId: string, params?: { limit?: number; offset?: number }) {
    return this.ponPortRepository.listByOlt(oltId, params);
  }

  async updatePonPort(id: string, portData: UpdatePonPortInput) {
    const updatedPort = await this.ponPortRepository.update(id, portData);
    if (!updatedPort) {
      throw new NotFoundError('PON Port');
    }
    return updatedPort;
  }
}