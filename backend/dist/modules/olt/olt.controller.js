export class OltController {
    oltService;
    constructor(oltService) {
        this.oltService = oltService;
    }
    async testConnection(request, reply) {
        const { ipAddress, port } = request.body;
        const isConnected = await this.oltService.testConnection(ipAddress, port);
        if (isConnected) {
            return reply.send({ success: true, message: 'Connection successful' });
        }
        else {
            return reply.status(400).send({ success: false, message: 'Connection failed' });
        }
    }
    async listOlts(request, reply) {
        const olts = await this.oltService.listOLTs({
            limit: request.query.limit,
            offset: request.query.offset,
        });
        return reply.send({ success: true, data: olts });
    }
    async getOlt(request, reply) {
        const olt = await this.oltService.getOlt(request.params.id);
        return reply.send({ success: true, data: olt });
    }
    async createOlt(request, reply) {
        const olt = await this.oltService.createOlt(request.body);
        return reply.status(201).send({
            success: true,
            data: olt,
        });
    }
    async updateOlt(request, reply) {
        const olt = await this.oltService.updateOlt(request.params.id, request.body);
        return reply.send({
            success: true,
            data: olt,
        });
    }
    async deleteOlt(request, reply) {
        await this.oltService.deleteOlt(request.params.id);
        return reply.send({ success: true, message: 'OLT deleted' });
    }
}
