process.env.NODE_ENV='test';
const request=require('supertest');
const app=require('../../src/app');
test('schools endpoint requires authentication',async()=>{const response=await request(app).get('/api/v1/schools');expect(response.statusCode).toBe(401)});
