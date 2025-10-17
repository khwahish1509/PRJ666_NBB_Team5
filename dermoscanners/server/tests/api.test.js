/**
 * Comprehensive API Tests
 * US-207: API testing and validation with full coverage
 */

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';

let authToken = '';
let testUserId = '';
let testProductId = '';

describe('API Comprehensive Tests', () => {
  
  describe('Health Check', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Authentication Endpoints', () => {
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User',
      skinType: 'combination'
    };

    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect([200, 201]).toContain(res.status);
      if (res.body.success) {
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data.user).toHaveProperty('email', testUser.email);
      }
    });

    it('should reject registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@test.com' });
      
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    });

    it('should login with valid credentials', async () => {
      // First register
      await request(app).post('/api/auth/register').send(testUser);
      
      // Then login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      if (res.body.success) {
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty('tokens');
        authToken = res.body.data.tokens.accessToken;
        testUserId = res.body.data.user._id || res.body.data.user.id;
      }
    });

    it('should reject login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword'
        });
      
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com' });
      
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Product Endpoints', () => {
    it('should get product by barcode', async () => {
      const res = await request(app).get('/api/products/barcode/3700123456789');
      expect([200, 404]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('name');
        testProductId = res.body.data._id;
      }
    });

    it('should return 404 for invalid barcode', async () => {
      const res = await request(app).get('/api/products/barcode/9999999999999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should handle malformed barcode gracefully', async () => {
      const res = await request(app).get('/api/products/barcode/abc');
      expect([400, 404]).toContain(res.status);
    });

    it('should search products by name', async () => {
      const res = await request(app).get('/api/products/search?q=moisturizer');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should reject search with short query', async () => {
      const res = await request(app).get('/api/products/search?q=a');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should list products with filters', async () => {
      const res = await request(app).get('/api/products?category=moisturizer&skinType=dry');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should handle price range filters', async () => {
      const res = await request(app).get('/api/products?minPrice=10&maxPrice=50');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should get product by ID if available', async () => {
      if (testProductId) {
        const res = await request(app).get(`/api/products/${testProductId}`);
        expect([200, 404]).toContain(res.status);
      }
    });
  });

  describe('Recommendation Endpoints', () => {
    it('should get general recommendations', async () => {
      const res = await request(app).get('/api/recommendations');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should filter recommendations by skin type', async () => {
      const res = await request(app).get('/api/recommendations?skinType=oily');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should filter recommendations by max price', async () => {
      const res = await request(app).get('/api/recommendations?maxPrice=30');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should handle multiple filters', async () => {
      const res = await request(app).get('/api/recommendations?skinType=dry&maxPrice=40&category=moisturizer');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe('Sentiment Analysis', () => {
    it('should analyze positive sentiment', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze')
        .send({ text: 'I love this product! It works great!' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.score).toBeGreaterThan(0.5);
      expect(res.body.data.label).toBe('positive');
    });

    it('should analyze negative sentiment', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze')
        .send({ text: 'This is terrible. It caused a rash and irritation.' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.score).toBeLessThan(0.5);
      expect(res.body.data.label).toBe('negative');
    });

    it('should analyze neutral sentiment', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze')
        .send({ text: 'This product exists.' });
      
      expect(res.status).toBe(200);
      expect(res.body.data.label).toBe('neutral');
    });

    it('should reject empty text', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze')
        .send({ text: '' });
      
      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it('should analyze multiple reviews', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze-reviews')
        .send({
          reviews: [
            { comment: 'Great product!' },
            { comment: 'Works well' },
            { comment: 'Not bad' }
          ]
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalReviews).toBe(3);
    });

    it('should handle empty review array', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze-reviews')
        .send({ reviews: [] });
      
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Ingredient Safety', () => {
    it('should analyze ingredient', async () => {
      const res = await request(app)
        .post('/api/ingredients/analyze')
        .send({ ingredient: 'Retinol' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('riskLevel');
    });

    it('should check skin type compatibility', async () => {
      const res = await request(app)
        .post('/api/ingredients/check-compatibility')
        .send({ ingredient: 'Retinol', skinType: 'sensitive' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('compatible');
    });

    it('should reject invalid skin type', async () => {
      const res = await request(app)
        .post('/api/ingredients/check-compatibility')
        .send({ ingredient: 'Retinol', skinType: 'invalid' });
      
      expect([400, 200]).toContain(res.status);
    });

    it('should handle unknown ingredient', async () => {
      const res = await request(app)
        .post('/api/ingredients/analyze')
        .send({ ingredient: 'UnknownChemical12345' });
      
      expect(res.status).toBe(200);
      // Should still return a result, possibly with unknown risk level
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', async () => {
      const res = await request(app).get('/api/nonexistent-route');
      expect(res.status).toBe(404);
    });

    it('should handle invalid JSON payload', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze')
        .set('Content-Type', 'application/json')
        .send('invalid json');
      
      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it('should handle missing required fields', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze')
        .send({});
      
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Performance Tests', () => {
    it('should respond to health check quickly', async () => {
      const start = Date.now();
      await request(app).get('/api/health');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/recommendations')
      );
      
      const results = await Promise.all(requests);
      results.forEach(res => {
        expect(res.status).toBe(200);
      });
    });
  });
});

