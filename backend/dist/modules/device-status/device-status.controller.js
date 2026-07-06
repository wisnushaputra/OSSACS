export class DeviceStatusController {
    deviceStatusService;
    constructor(deviceStatusService) {
        this.deviceStatusService = deviceStatusService;
    }
    async listLatestDeviceStatuses(request, reply) {
        const { limit, offset } = request.query;
        const statuses = await this.deviceStatusService.listLatestStatuses({ limit, offset });
        return reply.send({ success: true, data: statuses });
    }
    async getDeviceStatus(request, reply) {
        const { deviceId } = request.params;
        const status = await this.deviceStatusService.getLatestStatus(deviceId);
        return reply.send({ success: true, data: status });
    }
}
