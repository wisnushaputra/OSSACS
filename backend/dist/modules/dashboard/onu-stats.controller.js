export class OnuStatsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getOnlineOfflineLosDyingGaspCounts(req, reply) {
        const data = await this.service.getOnlineOfflineLosDyingGaspCounts(req.query);
        return reply.send({ success: true, data });
    }
    async getByVendor(req, reply) {
        const data = await this.service.getByVendor(req.query);
        return reply.send({ success: true, data });
    }
    async getByModel(req, reply) {
        const data = await this.service.getByModel(req.query);
        return reply.send({ success: true, data });
    }
    async getOpticalPowerDistribution(req, reply) {
        const data = await this.service.getOpticalPowerDistribution(req.query);
        return reply.send({ success: true, data });
    }
}
