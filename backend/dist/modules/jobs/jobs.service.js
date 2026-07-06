import { NotFoundError } from '../../lib/errors';
import { myQueue } from '../../lib/queue';
export class JobService {
    jobRepository;
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    async getJob(id) {
        const job = await this.jobRepository.findById(id);
        if (!job) {
            throw new NotFoundError('Job');
        }
        return job;
    }
    async searchJobs(params) {
        return this.jobRepository.search(params);
    }
    async retryJob(id) {
        const job = await this.jobRepository.findById(id);
        if (!job) {
            throw new NotFoundError('Job');
        }
        // Re-enqueue the job using BullMQ
        // The exact data might need to be adjusted based on the original job parameters
        await myQueue.add(job.jobName, job.data);
        // Update the local database record to reflect retrying
        return this.jobRepository.update(id, {
            status: 'RETRYING',
            attempts: job.attempts + 1,
            error: null,
            result: null,
            finishedAt: null,
        });
    }
}
