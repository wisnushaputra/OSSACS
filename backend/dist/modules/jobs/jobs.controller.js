export class JobController {
    jobService;
    constructor(jobService) {
        this.jobService = jobService;
    }
    async searchJobs(request, reply) {
        const jobs = await this.jobService.searchJobs(request.query);
        return reply.send({ success: true, data: jobs });
    }
    async getJob(request, reply) {
        const job = await this.jobService.getJob(request.params.id);
        return reply.send({ success: true, data: job });
    }
    async retryJob(request, reply) {
        const job = await this.jobService.retryJob(request.params.id);
        return reply.send({ success: true, data: job });
    }
}
