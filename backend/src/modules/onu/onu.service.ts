import { OnuRepository, OnuSearchParams, PaginatedResult } from './onu.repository';
import { CreateOnuInput, UpdateOnuInput } from './onu.schema';
import { NotFoundError, ConflictError } from '../../lib/errors';
import { onus } from '../../db/schema';

export class OnuService {
  constructor(private onuRepository: OnuRepository) {}

  async getOnu(id: string) {
    const onu = await this.onuRepository.findById(id);
    if (!onu) {
      throw new NotFoundError('ONU');
    }
    return onu;
  }

  async listOnus(params?: { limit?: number; offset?: number }): Promise<PaginatedResult<typeof onus.$inferSelect>> {
    return this.onuRepository.list(params);
  }

  async searchOnus(params: OnuSearchParams): Promise<PaginatedResult<typeof onus.$inferSelect>> {
    return this.onuRepository.search(params);
  }

  async createOnu(onuData: CreateOnuInput) {
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

  async updateOnu(id: string, onuData: UpdateOnuInput) {
    const updatedOnu = await this.onuRepository.update(id, onuData);
    if (!updatedOnu) {
      throw new NotFoundError('ONU');
    }
    return updatedOnu;
  }

  async deleteOnu(id: string) {
    const deletedOnu = await this.onuRepository.delete(id);
    if (!deletedOnu) {
      throw new NotFoundError('ONU');
    }
    return deletedOnu;
  }
}