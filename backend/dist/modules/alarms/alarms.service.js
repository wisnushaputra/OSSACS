import { NotFoundError } from '../../lib/errors';
export class AlarmService {
    alarmRepository;
    constructor(alarmRepository) {
        this.alarmRepository = alarmRepository;
    }
    async getAlarm(id) {
        const alarm = await this.alarmRepository.findById(id);
        if (!alarm) {
            throw new NotFoundError('Alarm');
        }
        return alarm;
    }
    async searchAlarms(params) {
        return this.alarmRepository.search(params);
    }
    async createAlarm(data) {
        return this.alarmRepository.create(data);
    }
    async updateAlarm(id, data) {
        const updatedAlarm = await this.alarmRepository.update(id, data);
        if (!updatedAlarm) {
            throw new NotFoundError('Alarm');
        }
        return updatedAlarm;
    }
    async deleteAlarm(id) {
        const deletedAlarm = await this.alarmRepository.delete(id);
        if (!deletedAlarm) {
            throw new NotFoundError('Alarm');
        }
        return deletedAlarm;
    }
    async acknowledgeAlarm(id) {
        const alarm = await this.alarmRepository.acknowledge(id);
        if (!alarm) {
            throw new NotFoundError('Alarm');
        }
        return alarm;
    }
    async resolveAlarm(id) {
        const alarm = await this.alarmRepository.resolve(id);
        if (!alarm) {
            throw new NotFoundError('Alarm');
        }
        return alarm;
    }
}
