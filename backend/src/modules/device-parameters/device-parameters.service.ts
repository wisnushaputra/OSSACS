import { DeviceParameterRepository, DeviceParameterSearchParams } from './device-parameters.repository';
import { NotFoundError } from '../../lib/errors';
import { deviceParameters } from '../../db/schema';

type CreateDeviceParameterInput = Omit<typeof deviceParameters.$inferInsert, 'id' | 'createdAt'>;

export class DeviceParameterService {
  constructor(private deviceParameterRepository: DeviceParameterRepository) {}

  async getLatestParameters(onuId: string) {
    const parameters = await this.deviceParameterRepository.getLatestParameters(onuId);
    if (!parameters) {
      throw new NotFoundError('Device parameters');
    }
    return parameters;
  }

  async getParameterHistory(onuId: string, params: DeviceParameterSearchParams) {
    return this.deviceParameterRepository.getHistory(onuId, params);
  }

  async createParameters(data: CreateDeviceParameterInput) {
    return this.deviceParameterRepository.create(data);
  }
}
