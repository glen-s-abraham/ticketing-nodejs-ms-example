import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';



const stan = nats.connect('ticketing',randomBytes(3).toString('hex'),{
    url:'http://localhost:4222'
});

const options = stan.subscriptionOptions()
.setManualAckMode(true);

stan.on('connect',()=>{
    console.log('Subscriber coonnected to nats');
    stan.on('close',()=>{
        console.log('nats connection closed');
        process.exit();
    })
   const subscription = stan.subscribe('ticket:created','subQueueGrp',options);
   subscription.on('message',(msg:Message)=>{
    const data = msg.getData();
    if(typeof data === 'string'){
        console.log(`Recieved event #${msg.getSequence()},with data: ${data}`);
    }
    msg.ack();
   })
})

//catch restart or termination signals
process.on('SIGINT',()=>stan.close());
process.on('SIGTERM',()=>stan.close());