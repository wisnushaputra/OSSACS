export class VendorController {
    vendorService;
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    async listVendors(request, reply) {
        const limit = request.query.limit ? Number(request.query.limit) : undefined;
        const offset = request.query.offset ? Number(request.query.offset) : undefined;
        const vendorsResult = await this.vendorService.listVendors(limit, offset);
        return reply.send({ success: true, data: vendorsResult });
    }
    async getVendor(request, reply) {
        const vendor = await this.vendorService.getVendor(request.params.id);
        return reply.send({ success: true, data: vendor });
    }
    async createVendor(request, reply) {
        const vendor = await this.vendorService.createVendor(request.body);
        return reply.status(201).send({
            success: true,
            data: vendor,
        });
    }
    async updateVendor(request, reply) {
        const vendor = await this.vendorService.updateVendor(request.params.id, request.body);
        return reply.send({
            success: true,
            data: vendor,
        });
    }
    async deleteVendor(request, reply) {
        await this.vendorService.deleteVendor(request.params.id);
        return reply.send({ success: true, message: 'Vendor deleted' });
    }
}
