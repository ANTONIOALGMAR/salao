const request = require('supertest');
const app = require('../../index');
const Service = require('../../models/Service');

describe('Service Routes', () => {
  afterEach(async () => {
    await Service.deleteMany();
  });

  describe('GET /api/services', () => {
    it('should return an empty array when no services exist', async () => {
      const res = await request(app).get('/api/services');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('should return all services', async () => {
      const services = [
        { name: 'Service 1', description: 'Description 1', price: 10, duration: 30 },
        { name: 'Service 2', description: 'Description 2', price: 20, duration: 60 },
      ];
      await Service.insertMany(services);

      const res = await request(app).get('/api/services');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0].name).toEqual('Service 1');
      expect(res.body[1].name).toEqual('Service 2');
    });
  });
});
