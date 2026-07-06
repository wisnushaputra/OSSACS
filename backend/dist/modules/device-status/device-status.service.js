import { NotFoundError } from '../../lib/errors';
export class DeviceStatusService {
    deviceStatusRepository;
    constructor(deviceStatusRepository) {
        this.deviceStatusRepository = deviceStatusRepository;
    }
    async getLatestStatus(onuId) {
        const status = await this.deviceStatusRepository.findByOnuId(onuId);
        if (!status) {
            throw new NotFoundError('Device status');
        }
        return status;
    }
    async listLatestStatuses(params) {
        return this.deviceStatusRepository.list(params);
    }
    async createStatus(data) {
        return this.deviceStatusRepository.create(data);
    }
}
