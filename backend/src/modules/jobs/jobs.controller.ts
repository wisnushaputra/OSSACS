import { FastifyReply, FastifyRequest } from 'fastify';
import { JobService } from './jobs.service';
import { jobSchemas, JobSearchQuery } from './jobs.schema';
import { z } from 'zod';

export class JobController {
  constructor(private jobService: JobService) {}

  async searchJobs(
    request: FastifyRequest<{ Querystring: z.infer<typeof jobSchemas.jobSearchQuerySchema> }>,
    reply: FastifyReply,
  ) {
    const jobs = await this.jobService.searchJobs(request.query);
    return reply.send({ success: true, data: jobs });
  }

  async getJob(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const job = await this.jobService.getJob(request.params.id);
    return reply.send({ success: true, data: job });
  }

  async retryJob(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const job = await this.jobService.retryJob(request.params.id);
    return reply.send({ success: true, data: job });
  }
}
