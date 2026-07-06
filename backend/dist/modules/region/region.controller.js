export class RegionController {
    regionService;
    constructor(regionService) {
        this.regionService = regionService;
    }
    async listRegions(request, reply) {
        const limit = request.query.limit ? Number(request.query.limit) : undefined;
        const offset = request.query.offset ? Number(request.query.offset) : undefined;
        const result = await this.regionService.listRegions(limit, offset);
        return reply.send({ success: true, data: result });
    }
    async getRegion(request, reply) {
        const region = await this.regionService.getRegion(request.params.id);
        return reply.send({ success: true, data: region });
    }
    async createRegion(request, reply) {
        const region = await this.regionService.createRegion(request.body);
        return reply.status(201).send({ success: true, data: region });
    }
    async updateRegion(request, reply) {
        const region = await this.regionService.updateRegion(request.params.id, request.body);
        return reply.send({ success: true, data: region });
    }
    async deleteRegion(request, reply) {
        await this.regionService.deleteRegion(request.params.id);
        return reply.send({ success: true, message: 'Region deleted' });
    }
}
