import { NotFoundError, ConflictError } from '../../lib/errors';
export class OnuService {
    onuRepository;
    constructor(onuRepository) {
        this.onuRepository = onuRepository;
    }
    async getOnu(id) {
        const onu = await this.onuRepository.findById(id);
        if (!onu) {
            throw new NotFoundError('ONU');
        }
        return onu;
    }
    async listOnus(params) {
        return this.onuRepository.list(params);
    }
    async searchOnus(params) {
        return this.onuRepository.search(params);
    }
    async createOnu(onuData) {
        const existingSerial = await this.onuRepository.findBySerialNumber(onuData.serialNumber);
        if (existingSerial) {
            throw new ConflictError('ONU with this Serial Number already exists');
        }
        const existingGenie = await this.onuRepository.findByGenieDeviceId(onuData.genieDeviceId);
        if (existingGenie) {
            throw new ConflictError('ONU with this GenieACS Device ID already exists');
        }
        const onu = await this.onuRepository.create(onuData);
        return onu;
    }
    async updateOnu(id, onuData) {
        const updatedOnu = await this.onuRepository.update(id, onuData);
        if (!updatedOnu) {
            throw new NotFoundError('ONU');
        }
        return updatedOnu;
    }
    async deleteOnu(id) {
        const deletedOnu = await this.onuRepository.delete(id);
        if (!deletedOnu) {
            throw new NotFoundError('ONU');
        }
        return deletedOnu;
    }
}
