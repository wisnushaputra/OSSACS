import { FastifyReply, FastifyRequest } from 'fastify';
import { EventService } from './events.service';
import { eventSchemas, EventSearchQuery, CreateEventLogInput } from './events.schema';
import { z } from 'zod';

export class EventController {
  constructor(private eventService: EventService) {}

  async searchEvents(
    request: FastifyRequest<{ Querystring: z.infer<typeof eventSchemas.eventSearchQuerySchema> }>,
    reply: FastifyReply,
  ) {
    const events = await this.eventService.searchEvents(request.query);
    return reply.send({ success: true, data: events });
  }

  async createEvent(
    request: FastifyRequest<{ Body: CreateEventLogInput }>,
    reply: FastifyReply,
  ) {
    const event = await this.eventService.logEvent(request.body);
    return reply.status(201).send({ success: true, data: event });
  }
}
