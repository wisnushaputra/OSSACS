export class EventService {
    eventRepository;
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async logEvent(data) {
        return this.eventRepository.create(data);
    }
    async searchEvents(params) {
        return this.eventRepository.search(params);
    }
}
