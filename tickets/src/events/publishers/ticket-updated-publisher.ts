import { Publisher, Subjects,  TicketUpdatedEvent } from "@glticket/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
