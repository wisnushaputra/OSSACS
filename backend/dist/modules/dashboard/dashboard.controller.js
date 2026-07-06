export class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDashboardSummary(request, reply) {
        const userPermissions = request.user?.permissions || [];
        const summary = await this.dashboardService.getDashboardSummary(request.query, userPermissions);
        return reply.send({ success: true, ...summary });
    }
}
