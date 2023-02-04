import { OrderCreatedEvent, Publisher, Subjects } from "@glticket/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}