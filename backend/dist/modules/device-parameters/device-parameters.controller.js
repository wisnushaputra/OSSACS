export class DeviceParameterController {
    deviceParameterService;
    constructor(deviceParameterService) {
        this.deviceParameterService = deviceParameterService;
    }
    async getLatestDeviceParameters(request, reply) {
        const { onuId } = request.params;
        const parameters = await this.deviceParameterService.getLatestParameters(onuId);
        return reply.send({ success: true, data: parameters });
    }
    async getDeviceParameterHistory(request, reply) {
        const { onuId } = request.params;
        const { limit, offset, startDate, endDate } = request.query;
        const history = await this.deviceParameterService.getParameterHistory(onuId, {
            limit,
            offset,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
        return reply.send({ success: true, data: history });
    }
}
