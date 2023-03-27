import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

let res: any;
const data: Object = {
  "fullname": "asd18",
  "email": "asd18",
  "phone": "1231218",
  "address": "asd",
  "tags": ["641dafc828ec00dde4ff7f62"]
};

describe("Add contact request working well", () => {
  beforeAll(async () => {
    res = await request(app)
      .put("/contact")
      .send(data);
  });

  test("Success - Response code is 201", () => {
    expect(res.statusCode).toEqual(201);
  });

  test("Success - Response type is json", () => {
    expect(res.type).toEqual('application/json');
  });
});

describe("Edit contact request working well", () => {
  beforeAll(async () => {
    res = await request(app)
      .post(`/contact/${res.body._id}`)
      .send({
        "address": "asd18"
      });
  });

  test("Success - Response code is 200", () => {
    expect(res.statusCode).toEqual(200);
  });

  test("Success - Response type is json", () => {
    expect(res.type).toEqual('application/json');
  });
});

describe("Delete contact request working well", () => {
  beforeAll(async () => {
    res = await request(app)
      .delete(`/contact/${res.body._id}`);
  });

  test("Success - Response code is 200", () => {
    expect(res.statusCode).toEqual(200);
  });

  test("Success - Response type is json", () => {
    expect(res.type).toEqual('application/json');
  });
});

afterAll(async () => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
});