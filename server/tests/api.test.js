const request = require('supertest');
const { app } = require('../app');

const mockUser = { _id: 'uid123', name: 'Test User', email: 'test@test.com', role: 'patient' };

jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));
jest.mock('../models/RecoveryRecord', () => ({
  find: jest.fn(() => ({ sort: jest.fn(() => ({ skip: jest.fn(() => ({ limit: jest.fn(() => Promise.resolve([])) })) })) })),
  findOne: jest.fn(),
  countDocuments: jest.fn(() => Promise.resolve(0)),
  create: jest.fn(),
}));
jest.mock('../models/Notification', () => ({
  find: jest.fn(() => ({ sort: jest.fn(() => ({ limit: jest.fn(() => Promise.resolve([])) })) })),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const User = require('../models/User');
const RecoveryRecord = require('../models/RecoveryRecord');

describe('Auth Endpoints', () => {
  it('POST /api/auth/register - creates user', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: 'uid123', name: 'Test', email: 'test@test.com', role: 'patient', password: 'hashed' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('POST /api/auth/login - rejects invalid credentials', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
  });
});

describe('Health Endpoint', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});