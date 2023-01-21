import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';



const stan = nats.connect('ticketing',randomBytes(3).toString('hex'),{
    url:'http://localhost:4222'
});



stan.on('connect',()=>{
    console.log('Subscriber coonnected to nats');
    stan.on('close',()=>{
        console.log('nats connection closed');
        process.exit();
    })
    new TicketCreatedListener(stan).listen();

})

//catch restart or termination signals
process.on('SIGINT',()=>stan.close());
process.on('SIGTERM',()=>stan.close());




