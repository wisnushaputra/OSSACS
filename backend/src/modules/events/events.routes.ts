import { FastifyInstance } from 'fastify';
import { EventController } from './events.controller';
import { EventRepository } from './events.repository';
import { EventService } from './events.service';
import { eventSchemas, EventSearchQuery, CreateEventLogInput } from './events.schema';
import { z } from 'zod';

export async function eventRoutes(server: FastifyInstance) {
  const eventRepository = new EventRepository();
  const eventService = new EventService(eventRepository);
  const eventController = new EventController(eventService);

  server.get<{
    Querystring: z.infer<typeof eventSchemas.eventSearchQuerySchema>;
    Reply: typeof eventSchemas.eventLogsPaginatedApiResponseSchema;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['event_log:read'])],
      schema: {
        querystring: eventSchemas.eventSearchQuerySchema,
        response: { 200: eventSchemas.eventLogsPaginatedApiResponseSchema },
      },
    },
    eventController.searchEvents.bind(eventController),
  );

  // We expose creation via API, but usually events are logged internally by other services.
  server.post<{
    Body: CreateEventLogInput;
  }>(
    '/',
    {
      preHandler: [server.authenticate, server.authorize(['event_log:create'])],
      schema: {
        body: eventSchemas.createEventLogSchema,
      },
    },
    eventController.createEvent.bind(eventController),
  );
}
