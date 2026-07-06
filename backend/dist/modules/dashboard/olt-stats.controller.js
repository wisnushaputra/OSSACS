export class OltStatsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getHealthSummary(req, reply) {
        const data = await this.service.getHealthSummary(req.query);
        return reply.send({ success: true, data });
    }
    async getByVendor(req, reply) {
        const data = await this.service.getByVendor(req.query);
        return reply.send({ success: true, data });
    }
    async getPonPortUtilization(req, reply) {
        const data = await this.service.getPonPortUtilization(req.query);
        return reply.send({ success: true, data });
    }
    async getOnuCapacityUsage(req, reply) {
        const data = await this.service.getOnuCapacityUsage(req.query);
        return reply.send({ success: true, data });
    }
}
