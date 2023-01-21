import { Message, Stan } from "node-nats-streaming";
import { Listener } from "./listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";



export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject=Subjects.TicketCreated;
    queueGroupName='payments-service';
    constructor(client:Stan){
        super(client);
    }
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!',data);
        console.log(data.title);
        msg.ack();
    }
    
}