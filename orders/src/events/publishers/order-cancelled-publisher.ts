import { OrderCancelledEvent, Publisher, Subjects } from "@glticket/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}