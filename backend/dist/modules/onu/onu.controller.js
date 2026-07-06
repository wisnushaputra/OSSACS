export class OnuController {
    onuService;
    constructor(onuService) {
        this.onuService = onuService;
    }
    async listOnus(request, reply) {
        const onus = await this.onuService.listOnus({
            limit: request.query.limit,
            offset: request.query.offset,
        });
        return reply.send({ success: true, data: onus });
    }
    async searchOnus(request, reply) {
        const onus = await this.onuService.searchOnus({
            query: request.query.q,
            customerId: request.query.customerId,
            oltId: request.query.oltId,
            vendor: request.query.vendor,
            status: request.query.status,
            limit: request.query.limit,
            offset: request.query.offset,
        });
        return reply.send({ success: true, data: onus });
    }
    async getOnu(request, reply) {
        const onu = await this.onuService.getOnu(request.params.id);
        return reply.send({ success: true, data: onu });
    }
    async createOnu(request, reply) {
        const onu = await this.onuService.createOnu(request.body);
        return reply.status(201).send({
            success: true,
            data: onu,
        });
    }
    async updateOnu(request, reply) {
        const onu = await this.onuService.updateOnu(request.params.id, request.body);
        return reply.send({
            success: true,
            data: onu,
        });
    }
    async deleteOnu(request, reply) {
        await this.onuService.deleteOnu(request.params.id);
        return reply.send({ success: true, message: 'ONU deleted' });
    }
}
