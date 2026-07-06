export class AlarmStatsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getActiveAlarmCounter(req, reply) {
        const data = await this.service.getActiveAlarmCounter(req.query);
        return reply.send({ success: true, data });
    }
    async getAlarmBySeverity(req, reply) {
        const data = await this.service.getAlarmBySeverity(req.query);
        return reply.send({ success: true, data });
    }
    async getAlarmTrend(req, reply) {
        const { interval, ...filters } = req.query;
        const data = await this.service.getAlarmTrend(interval || '24h', filters);
        return reply.send({ success: true, data });
    }
    async getLatestAlarmTable(req, reply) {
        const { limit, ...filters } = req.query;
        const data = await this.service.getLatestAlarmsTable(limit, filters);
        return reply.send({ success: true, data });
    }
}
