import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing','pub',{
    url:'http://localhost:4222'
});

stan.on('connect',()=>{
    console.log('Publisher coonnected to nats');

    const data = JSON.stringify({
        id:'123',
        title:'concert',
        price:20
    });

    stan.publish('ticket:created',data,()=>{
        console.log('event published')
    });
})