import request from 'supertest';
import { app} from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exists',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',signin())
    .send({
        title:'asdfk',
        price:20
    })
    .expect(404);
})

it('returns a 401 if the user is not authenticated',async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title:'asdfk',
        price:20
    })
    .expect(401);
})

it('returns a 401 if the user does not own the ticket',async()=>{
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',signin())
    .send({
        title:'test',
        price: 20
    })

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',signin())
    .send({
        title:'test',
        price:20
    })
    .expect(401);


})

it('returns a 400 if the user provide and invalid title or price',async()=>{
    const cookie = signin() 
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'test',
        price: 20
    })

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'',
        price:20
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'test',
        price:-10
    })
    .expect(400);

})

it('updates the ticket provided valid inputs',async()=>{
    const cookie = signin() 
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'test',
        price: 20
    })

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'new title',
        price:30
    })
    .expect(200);

    const ticketRes = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

    expect(ticketRes.body.title).toEqual('new title');
    expect(ticketRes.body.price).toEqual(30);
})

it('published an event',async()=>{
    const cookie = signin() 
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'test',
        price: 20
    })

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'new title',
        price:30
    })
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})