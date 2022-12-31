import request from "supertest";
import { app } from "../../app";



it("fails when email that does not exist is supplied", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

it("fails when an incorrect password id provided", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    }).expect(201);

    return request(app)
    .post("/api/users/signin")
    .send({
        email: "test@test.com",
        password: "invalidpassword",
    })
    .expect(400)
});

it("responds with cookie when given valid credentials", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      }).expect(201);
  
      const response =await request(app)
      .post("/api/users/signin")
      .send({
          email: "test@test.com",
          password: "password",
      })
      .expect(200)

      expect(response.get('Set-Cookie'));
  });

