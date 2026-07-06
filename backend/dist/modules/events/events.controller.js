export class EventController {
    eventService;
    constructor(eventService) {
        this.eventService = eventService;
    }
    async searchEvents(request, reply) {
        const events = await this.eventService.searchEvents(request.query);
        return reply.send({ success: true, data: events });
    }
    async createEvent(request, reply) {
        const event = await this.eventService.logEvent(request.body);
        return reply.status(201).send({ success: true, data: event });
    }
}
