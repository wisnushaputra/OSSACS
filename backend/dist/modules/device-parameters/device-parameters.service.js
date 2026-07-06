import { NotFoundError } from '../../lib/errors';
export class DeviceParameterService {
    deviceParameterRepository;
    constructor(deviceParameterRepository) {
        this.deviceParameterRepository = deviceParameterRepository;
    }
    async getLatestParameters(onuId) {
        const parameters = await this.deviceParameterRepository.getLatestParameters(onuId);
        if (!parameters) {
            throw new NotFoundError('Device parameters');
        }
        return parameters;
    }
    async getParameterHistory(onuId, params) {
        return this.deviceParameterRepository.getHistory(onuId, params);
    }
    async createParameters(data) {
        return this.deviceParameterRepository.create(data);
    }
}
