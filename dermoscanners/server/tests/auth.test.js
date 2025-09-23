import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server.js';

describe('Auth API', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dermoscanners_test';
    await mongoose.connect(uri);
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('registers and logs in a user', async () => {
    const email = `user${Date.now()}@test.com`;
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password: 'Aa!23456', skinGoals: 'Improve hydration' })
      .expect(201);
    expect(reg.body.user.email).toBe(email);
    expect(reg.body.tokens.accessToken).toBeTruthy();

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'Aa!23456' })
      .expect(200);
    expect(login.body.user.email).toBe(email);
    expect(login.body.tokens.accessToken).toBeTruthy();
  });
});

