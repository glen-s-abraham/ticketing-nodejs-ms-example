import { Publisher, Subjects, TicketCreatedEvent } from "@glticket/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
