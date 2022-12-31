import request from "supertest";
import { app } from "../../app";

it("returns a 201 on sucessfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest@test.com",
      password: "password",
    })
    .expect(201);
});

it("return a 400 with an invalid email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "invalidemail",
      password: "password",
    })
    .expect(400);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "invalidemail",
      password: "123",
    })
    .expect(400);
});

it("return a 400 with an empty email and password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "valid@valid.com",
      })
      .expect(400);
  
    return request(app)
      .post("/api/users/signup")
      .send({
        password: "password",
      })
      .expect(400);
  });

  it("disallows duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "valid@valid.com",
        password:"password"
      })
      .expect(201);
  
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "valid@valid.com",
        password:"password"
      })
      .expect(400);
  });

  it("sets a cookie after successfull signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "valid@valid.com",
        password:"password"
      })
      .expect(201);

      expect(response.get('Set-Cookie')).toBeDefined();
  
  });
  

