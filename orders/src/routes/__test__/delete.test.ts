import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';


it('it marks an order as cancelled',async()=>{
    const ticket = Ticket.build({
        title:'concert',
        price:20
    })
    await ticket.save();

    const user = global.signin();

    const {body:order}=await request(app)
    .post("/api/orders")
    .set('Cookie',user)
    .send({ticketId:ticket.id})
    .expect(201)

    const {body:fetchedOrder}=await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie',user)
    .send()
    .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);

})


it('it returns an error if one user try to cancel an order',async()=>{
    const ticket = Ticket.build({
        title:'concert',
        price:20
    })
    await ticket.save();

    const user = global.signin();

    const {body:order}=await request(app)
    .post("/api/orders")
    .set('Cookie',user)
    .send({ticketId:ticket.id})
    .expect(201)

    const {body:fetchedOrder}=await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie',global.signin())
    .send()
    .expect(401);
})