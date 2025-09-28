const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');
const generateToken = require('../../utils/generateToken');

describe('User Routes', () => {
  let adminToken;

  beforeAll(async () => {
    await User.deleteMany({});
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = generateToken(adminUser._id);
  });

  afterEach(async () => {
    await User.deleteMany({ email: { $ne: 'admin@example.com' } });
  });

  describe('POST /api/users', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toEqual('Test User');
    });

    it('should not register a user with an existing email', async () => {
      await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/users/login', () => {
    it('should login a user with correct credentials', async () => {
      await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'login@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login a user with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/users', () => {
    it('should get all users for an admin', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should not get all users for a non-admin', async () => {
      const user = await User.create({
        name: 'Non-Admin User',
        email: 'nonadmin@example.com',
        password: 'password123',
      });
      const userToken = generateToken(user._id);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(401);
    });
  });
});
