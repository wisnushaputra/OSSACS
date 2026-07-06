import { FastifyInstance } from 'fastify';
import { JobController } from './jobs.controller';
import { JobRepository } from './jobs.repository';
import { JobService } from './jobs.service';
import { jobSchemas } from './jobs.schema';
import { z } from 'zod';

const idParamsSchema = z.object({ id: z.string().uuid() });

export async function jobRoutes(server: FastifyInstance) {
  const jobRepository = new JobRepository();
  const jobService = new JobService(jobRepository);
  const jobController = new JobController(jobService);

  // Search Jobs (GET /api/v1/jobs)
  server.get<{
    Querystring: z.infer<typeof jobSchemas.jobSearchQuerySchema>;
    Reply: typeof jobSchemas.jobsPaginatedApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['job:read'])],
      schema: {
        querystring: jobSchemas.jobSearchQuerySchema,
        response: { 200: jobSchemas.jobsPaginatedApiResponseSchema },
      },
    },
    jobController.searchJobs.bind(jobController),
  );

  // Get Job by ID (GET /api/v1/jobs/:id)
  server.get<{
    Params: z.infer<typeof idParamsSchema>;
    Reply: typeof jobSchemas.jobApiResponseSchema;
  }>(
    '/:id',
    {
      preHandler: [server.authenticate, server.authorize(['job:read'])],
      schema: {
        params: idParamsSchema,
        response: { 200: jobSchemas.jobApiResponseSchema },
      },
    },
    jobController.getJob.bind(jobController),
  );

  // Retry Job (POST /api/v1/jobs/:id/retry)
  server.post<{
    Params: z.infer<typeof idParamsSchema>;
    Reply: typeof jobSchemas.jobApiResponseSchema;
  }>(
    '/:id/retry',
    {
      preHandler: [server.authenticate, server.authorize(['job:update'])],
      schema: {
        params: idParamsSchema,
        response: { 200: jobSchemas.jobApiResponseSchema },
      },
    },
    jobController.retryJob.bind(jobController),
  );
}
