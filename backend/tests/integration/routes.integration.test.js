process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../../src/app');

describe('Critical API route registration', () => {
  test('auth login route is mounted', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.status).not.toBe(404);
  });

  test('upload signature route is mounted and protected', async () => {
    const res = await request(app).post('/api/v1/uploads/sign').send({});
    expect(res.status).toBe(401);
  });

  test('school preferences route is mounted and protected', async () => {
    const res = await request(app).get('/api/v1/school-preferences');
    expect(res.status).toBe(401);
  });

  test('module catalog route is mounted and protected', async () => {
    const res = await request(app).get('/api/v1/modules');
    expect(res.status).toBe(401);
  });
});
