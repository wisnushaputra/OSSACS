import { OpticalHistoryRepository, OpticalHistorySearchParams } from './optical-history.repository';
import { opticalHistory } from '../../db/schema';

type CreateOpticalHistoryInput = Omit<typeof opticalHistory.$inferInsert, 'id' | 'createdAt'>;

export class OpticalHistoryService {
  constructor(private opticalHistoryRepository: OpticalHistoryRepository) {}

  async searchOpticalHistory(params: OpticalHistorySearchParams) {
    return this.opticalHistoryRepository.search(params);
  }

  async createOpticalHistory(data: CreateOpticalHistoryInput) {
    return this.opticalHistoryRepository.create(data);
  }
}
