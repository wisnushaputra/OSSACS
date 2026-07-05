import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { ZodError } from 'zod';

export function setupErrorHandler(fastify: FastifyInstance<any, any, any, any>) {
  fastify.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    // Handling custom AppError
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    // Handling Zod validation errors
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      }));

      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: formattedErrors,
        },
      });
    }

    // Handling built-in Fastify validation errors (if Zod validator compiler is set)
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.validation,
        },
      });
    }

    // Unhandled / Unexpected Errors
    logger.error(error, `Unhandled error during request: ${request.method} ${request.url}`);

    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred. Please contact the administrator.',
      },
    });
  });
}
