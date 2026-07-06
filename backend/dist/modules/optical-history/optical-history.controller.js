export class OpticalHistoryController {
    opticalHistoryService;
    constructor(opticalHistoryService) {
        this.opticalHistoryService = opticalHistoryService;
    }
    async searchOpticalHistory(request, reply) {
        const { onuId, startDate, endDate, limit, offset } = request.query;
        const history = await this.opticalHistoryService.searchOpticalHistory({
            onuId,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit,
            offset,
        });
        return reply.send({ success: true, data: history });
    }
}
