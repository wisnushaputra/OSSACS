export class OpticalHistoryService {
    opticalHistoryRepository;
    constructor(opticalHistoryRepository) {
        this.opticalHistoryRepository = opticalHistoryRepository;
    }
    async searchOpticalHistory(params) {
        return this.opticalHistoryRepository.search(params);
    }
    async createOpticalHistory(data) {
        return this.opticalHistoryRepository.create(data);
    }
}
