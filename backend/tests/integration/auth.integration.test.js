process.env.NODE_ENV='test';
const request=require('supertest');
const app=require('../../src/app');
test('GET /health returns API status',async()=>{const response=await request(app).get('/health');expect(response.statusCode).toBe(200);expect(response.body.success).toBe(true)});
