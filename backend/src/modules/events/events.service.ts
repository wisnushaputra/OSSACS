import { EventRepository } from './events.repository';
import { CreateEventLogInput, EventSearchQuery } from './events.schema';

export class EventService {
  constructor(private eventRepository: EventRepository) {}

  async logEvent(data: CreateEventLogInput) {
    return this.eventRepository.create(data);
  }

  async searchEvents(params: EventSearchQuery) {
    return this.eventRepository.search(params);
  }
}
