import { DeviceStatusRepository, DeviceStatusSearchParams } from './device-status.repository';
import { NotFoundError } from '../../lib/errors';

export class DeviceStatusService {
  constructor(private deviceStatusRepository: DeviceStatusRepository) {}

  async getLatestStatus(onuId: string) {
    const status = await this.deviceStatusRepository.findByOnuId(onuId);
    if (!status) {
      throw new NotFoundError('Device status');
    }
    return status;
  }

  async listLatestStatuses(params?: DeviceStatusSearchParams) {
    return this.deviceStatusRepository.list(params);
  }

  async createStatus(data: {
    onuId: string;
    status: 'ONLINE' | 'OFFLINE' | 'LOS' | 'DYING_GASP' | 'DISABLED' | 'UNKNOWN';
    rxPower?: string | null;
    txPower?: string | null;
    uptime?: number | null;
    ipAddress?: string | null;
    lastInform?: Date | null;
    lastContact?: Date | null;
  }) {
    return this.deviceStatusRepository.create(data);
  }
}
