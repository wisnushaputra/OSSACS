export class CustomerStatsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getStatusSummary(req, reply) {
        const data = await this.service.getStatusSummary(req.query);
        return reply.send({ success: true, data });
    }
    async getByRegion(req, reply) {
        const data = await this.service.getByRegion(req.query);
        return reply.send({ success: true, data });
    }
    async getByPop(req, reply) {
        const data = await this.service.getByPop(req.query);
        return reply.send({ success: true, data });
    }
    async getTrend(req, reply) {
        const { interval, ...filters } = req.query;
        // Map interval from routes to valid trend intervals
        let mappedInterval = 'day';
        if (interval === 'week' || interval === '7d') {
            mappedInterval = 'week';
        }
        else if (interval === 'month' || interval === '30d' || interval === 'all') {
            mappedInterval = 'month';
        }
        const data = await this.service.getTrend(mappedInterval, filters);
        return reply.send({ success: true, data });
    }
}
