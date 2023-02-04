import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const _createTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticket1 = await _createTicket();
  const ticket2 = await _createTicket();
  const ticket3 = await _createTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(201);
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);


    expect(response.body.length).toEqual(2)
});
