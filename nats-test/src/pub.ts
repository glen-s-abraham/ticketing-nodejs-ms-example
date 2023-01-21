import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing','pub',{
    url:'http://localhost:4222'
});

stan.on('connect',async ()=>{
    console.log('Publisher coonnected to nats');
    const publisher = new TicketCreatedPublisher(stan);    
    await publisher.publish({id:'1235',title:'concert',price:20,userId:'test'})
})