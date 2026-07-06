import { AlarmRepository, AlarmSearchParams } from './alarms.repository';
import { CreateAlarmInput, UpdateAlarmInput } from './alarms.schema';
import { NotFoundError } from '../../lib/errors';

export class AlarmService {
  constructor(private alarmRepository: AlarmRepository) {}

  async getAlarm(id: string) {
    const alarm = await this.alarmRepository.findById(id);
    if (!alarm) {
      throw new NotFoundError('Alarm');
    }
    return alarm;
  }

  async searchAlarms(params: AlarmSearchParams) {
    return this.alarmRepository.search(params);
  }

  async createAlarm(data: CreateAlarmInput) {
    return this.alarmRepository.create(data);
  }

  async updateAlarm(id: string, data: UpdateAlarmInput) {
    const updatedAlarm = await this.alarmRepository.update(id, data);
    if (!updatedAlarm) {
      throw new NotFoundError('Alarm');
    }
    return updatedAlarm;
  }

  async deleteAlarm(id: string) {
    const deletedAlarm = await this.alarmRepository.delete(id);
    if (!deletedAlarm) {
      throw new NotFoundError('Alarm');
    }
    return deletedAlarm;
  }

  async acknowledgeAlarm(id: string) {
    const alarm = await this.alarmRepository.acknowledge(id);
    if (!alarm) {
      throw new NotFoundError('Alarm');
    }
    return alarm;
  }

  async resolveAlarm(id: string) {
    const alarm = await this.alarmRepository.resolve(id);
    if (!alarm) {
      throw new NotFoundError('Alarm');
    }
    return alarm;
  }
}
