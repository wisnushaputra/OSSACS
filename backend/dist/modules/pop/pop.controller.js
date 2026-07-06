export class PopController {
    popService;
    constructor(popService) {
        this.popService = popService;
    }
    async listPops(request, reply) {
        const limit = request.query.limit ? Number(request.query.limit) : undefined;
        const offset = request.query.offset ? Number(request.query.offset) : undefined;
        const result = await this.popService.listPops(limit, offset);
        return reply.send({ success: true, data: result });
    }
    async getPop(request, reply) {
        const pop = await this.popService.getPop(request.params.id);
        return reply.send({ success: true, data: pop });
    }
    async createPop(request, reply) {
        const pop = await this.popService.createPop(request.body);
        return reply.status(201).send({ success: true, data: pop });
    }
    async updatePop(request, reply) {
        const pop = await this.popService.updatePop(request.params.id, request.body);
        return reply.send({ success: true, data: pop });
    }
    async deletePop(request, reply) {
        await this.popService.deletePop(request.params.id);
        return reply.send({ success: true, message: 'Pop deleted' });
    }
}
