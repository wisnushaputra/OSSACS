import { FastifyReply, FastifyRequest } from 'fastify';
import { AlarmService } from './alarms.service';
import { CreateAlarmInput, UpdateAlarmInput, AlarmSearchQuery } from './alarms.schema';

export class AlarmController {
  constructor(private alarmService: AlarmService) {}

  async getAlarm(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const alarm = await this.alarmService.getAlarm(request.params.id);
    return reply.send({ success: true, data: alarm });
  }

  async searchAlarms(request: FastifyRequest<{ Querystring: AlarmSearchQuery }>, reply: FastifyReply) {
    const { limit, offset, onuId, type, severity, isResolved, startDate, endDate } = request.query;
    const alarms = await this.alarmService.searchAlarms({
      limit,
      offset,
      onuId,
      type,
      severity,
      isResolved,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
    return reply.send({ success: true, data: alarms });
  }

  async createAlarm(request: FastifyRequest<{ Body: CreateAlarmInput }>, reply: FastifyReply) {
    const alarm = await this.alarmService.createAlarm(request.body);
    return reply.status(201).send({ success: true, data: alarm });
  }

  async updateAlarm(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateAlarmInput }>,
    reply: FastifyReply,
  ) {
    const alarm = await this.alarmService.updateAlarm(request.params.id, request.body);
    return reply.send({ success: true, data: alarm });
  }

  async deleteAlarm(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.alarmService.deleteAlarm(request.params.id);
    return reply.send({ success: true, message: 'Alarm deleted' });
  }

  async acknowledgeAlarm(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const alarm = await this.alarmService.acknowledgeAlarm(request.params.id);
    return reply.send({ success: true, data: alarm });
  }

  async resolveAlarm(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const alarm = await this.alarmService.resolveAlarm(request.params.id);
    return reply.send({ success: true, data: alarm });
  }
}
