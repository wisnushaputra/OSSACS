export class SystemMetricsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getSystemMetrics(req, reply) {
        const data = await this.service.getSystemMetrics();
        return reply.send({ success: true, data });
    }
}
