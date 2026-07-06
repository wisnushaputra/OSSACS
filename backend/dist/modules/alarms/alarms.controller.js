export class AlarmController {
    alarmService;
    constructor(alarmService) {
        this.alarmService = alarmService;
    }
    async getAlarm(request, reply) {
        const alarm = await this.alarmService.getAlarm(request.params.id);
        return reply.send({ success: true, data: alarm });
    }
    async searchAlarms(request, reply) {
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
    async createAlarm(request, reply) {
        const alarm = await this.alarmService.createAlarm(request.body);
        return reply.status(201).send({ success: true, data: alarm });
    }
    async updateAlarm(request, reply) {
        const alarm = await this.alarmService.updateAlarm(request.params.id, request.body);
        return reply.send({ success: true, data: alarm });
    }
    async deleteAlarm(request, reply) {
        await this.alarmService.deleteAlarm(request.params.id);
        return reply.send({ success: true, message: 'Alarm deleted' });
    }
    async acknowledgeAlarm(request, reply) {
        const alarm = await this.alarmService.acknowledgeAlarm(request.params.id);
        return reply.send({ success: true, data: alarm });
    }
    async resolveAlarm(request, reply) {
        const alarm = await this.alarmService.resolveAlarm(request.params.id);
        return reply.send({ success: true, data: alarm });
    }
}
