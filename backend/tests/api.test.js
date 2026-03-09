// backend/tests/api.test.js
const request = require('supertest'); // You may need to npm install --save-dev supertest
const app = require('../app'); 

describe('ConnectUs Backend API', () => {
  it('should return a 200 status for the health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
  });

  it('should fetch available running groups', async () => {
    const res = await request(app).get('/api/groups');
    expect(Array.isArray(res.body)).toBe(true);
  });
});
