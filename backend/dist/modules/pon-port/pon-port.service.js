import { NotFoundError } from '../../lib/errors';
export class PonPortService {
    ponPortRepository;
    constructor(ponPortRepository) {
        this.ponPortRepository = ponPortRepository;
    }
    async getPonPort(id) {
        const port = await this.ponPortRepository.findById(id);
        if (!port) {
            throw new NotFoundError('PON Port');
        }
        return port;
    }
    async listPonPortsByOlt(oltId, params) {
        return this.ponPortRepository.listByOlt(oltId, params);
    }
    async updatePonPort(id, portData) {
        const updatedPort = await this.ponPortRepository.update(id, portData);
        if (!updatedPort) {
            throw new NotFoundError('PON Port');
        }
        return updatedPort;
    }
}
