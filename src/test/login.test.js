/* eslint-disable no-undef */
const request = require('supertest');
const { faker } = require('@faker-js/faker');
// const app = require('../app');
const baseURL = 'http://localhost:3000';

describe('POST /api/users/login', () => {
  it('should return status code 401 Unauthorized', async () => {
    const fakeUserData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const response = await request(baseURL).post('/api/users/login').send(fakeUserData);

    expect(response.status).toBe(401);
    expect(typeof response.body.message).toBe('string');
  });

  it('should return status code 200 and valid response', async () => {
    const validUserData = {
      email: 'nulla.ante@vestibul.co',
      password: '123',
    };
    const response = await request(baseURL).post('/api/users/login').send(validUserData);

    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe('string');
    expect(typeof response.body.user.email).toBe('string');
    expect(typeof response.body.user.subscription).toBe('string');
  });
});
