export class PonPortController {
    ponPortService;
    constructor(ponPortService) {
        this.ponPortService = ponPortService;
    }
    async listPonPorts(request, reply) {
        const { oltId } = request.params;
        const ports = await this.ponPortService.listPonPortsByOlt(oltId, {
            limit: request.query.limit,
            offset: request.query.offset,
        });
        return reply.send({ success: true, data: ports });
    }
    async getPonPort(request, reply) {
        const port = await this.ponPortService.getPonPort(request.params.id);
        return reply.send({ success: true, data: port });
    }
    async updatePonPort(request, reply) {
        const port = await this.ponPortService.updatePonPort(request.params.id, request.body);
        return reply.send({
            success: true,
            data: port,
        });
    }
}
