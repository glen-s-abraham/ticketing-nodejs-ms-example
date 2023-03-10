import request from 'supertest'
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper');

it('has a route handler listening to /api/tickets for post request',async()=>{
    const response = await request(app)
    .post('/api/tickets')
    .send({})

    expect(response.status).not.toEqual(404);
})

it('can only be accessed if the user is signed in',async()=>{
    const response = await request(app)
    .post('/api/tickets')
    .send({})

    expect(response.status).toEqual(401)
})

it('returns other than 401 if the user is signed in',async()=>{
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',signin())
    .send({})
    expect(response.status).not.toEqual(401);
})

it('returns an error if an invalid title is provided',async()=>{
   await request(app)
   .post('/api/tickets')
   .set('Cookie',signin())
   .send({
    title:'',
    price:10
   }).expect(400) 

   await request(app)
   .post('/api/tickets')
   .set('Cookie',signin())
   .send({
     price:10
   }).expect(400)

})

it('returns and error if an invalid price is provided',async()=>{
    await request(app)
   .post('/api/tickets')
   .set('Cookie',signin())
   .send({
    title:'test',
    price:-10
   }).expect(400) 

   await request(app)
   .post('/api/tickets')
   .set('Cookie',signin())
   .send({
        title:'test'
   }).expect(400)
})

it('creates a ticket with valid details',async()=>{
    
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
    .post('/api/tickets')
    .set('Cookie',signin())
    .send({
        title:'test',
        price:20
    })
    .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    
})

it('published an event',async()=>{
    const title='test';
    await request(app)
    .post('/api/tickets')
    .set('Cookie',signin())
    .send({
        title,
        price:20
    })
    .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})