import { server } from '..';
import request from 'supertest';
import { expect } from 'chai';

describe('express', function () {
  after(() => {
    server.close()
  })

  it('should respond with 200 for /status', async () => {
    const res = await request(server)
      .get('/status')
    expect(res.statusCode).to.equal(200)
  });

  it('should respond with 404 with non-existant routes', function testPath(done) {
    request(server)
      .get('/non-existant-path')
      .expect(404, done);
  });

  describe('basic auth', async () => {
    it('should respond with 200 when called with valid Authorization header value', async () => {
      const res = await request(server)
        .get('/basic-auth')
        .set('authorization', 'Basic bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==');
        expect(res.statusCode).to.equal(200);      
    });

    it('should respond with 401, "Invalid key" when called with invalid Authorization header value', async () => {
      const res = await request(server)
        .get('/basic-auth')
        .set('authorization', 'Basic bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==Invalid');
        expect(res.statusCode).to.equal(401);
        expect(res.text).to.equal('Invalid key');
    });

    it('should respond with 401, "Missing Basic prefix" when called Authorization header without the Basic prefix', async () => {
      const res = await request(server)
        .get('/basic-auth')
        .set('authorization', 'bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==');
        expect(res.statusCode).to.equal(401);
        expect(res.text).to.equal('Missing Basic prefix');
    });

    it('should respond with 401, "Missing username" when called Authorization header where username is missing', async () => {
      const res = await request(server)
        .get('/basic-auth')
        .set('authorization', 'Basic OnRoaXMgaXMgYSB2QGxpZCBwYXNzd29yZCE=');
        expect(res.statusCode).to.equal(401);
        expect(res.text).to.equal('Missing username');
    });

    it('should respond with 401, "Missing password" when called Authorization header where password is missing', async () => {
      const res = await request(server)
        .get('/basic-auth')
        .set('authorization', 'Basic bWF0dEBnbWFpbC5jb206');
        expect(res.statusCode).to.equal(401);
        expect(res.text).to.equal('Missing password');
    });

    it('should respond with 401, "Username/password connot contain :" when called where username/password contains a colon', async () => {
      const res = await request(server)
        .get('/basic-auth')
        .set('authorization', 'Basic bWF0dEBnbWFpOmwuY29tOnRoaXMgaXMgYSB2QGxpZCBwYXNzd29yZCE=');
        expect(res.statusCode).to.equal(401);
        expect(res.text).to.equal('Username/password connot contain :');
    });

  })

});