import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

let res: any;
const data: Object = {
  "name": "asd5"
};

describe("Add tag request working well", () => {
  beforeAll(async () => {
    res = await request(app)
      .put("/tag")
      .send(data);
  });

  test("Success - Response code is 201", () => {
    expect(res.statusCode).toEqual(201);
  });

  test("Success - Response type is json", () => {
    expect(res.type).toEqual('application/json');
  });
});

describe("Edit tag request working well", () => {
  beforeAll(async () => {
    res = await request(app)
      .post(`/tag/${res.body._id}`)
      .send({
        "name": "asd18"
      });
  });

  test("Success - Response code is 200", () => {
    expect(res.statusCode).toEqual(200);
  });

  test("Success - Response type is json", () => {
    expect(res.type).toEqual('application/json');
  });
});

describe("Delete tag request working well", () => {
  beforeAll(async () => {
    res = await request(app)
      .delete(`/tag/${res.body._id}`);
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