import request from 'supertest';
import app from '../src/app';

let res: any;

beforeEach(async () => {
  res = await request(app).get("/");
});

describe("Node & Express working well", () => {
  test("Index route response code 200", () => {
    expect(res.status).toEqual(200);
  });

  test("Index route response type is html", () => {
    expect(res.type).toEqual('text/html');
  })

  test("Index route response is exist", () => {
    expect(res.text).toEqual('Express + TypeScript Server');
  })
});