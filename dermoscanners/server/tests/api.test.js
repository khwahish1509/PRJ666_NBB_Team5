/**
 * Simple API Tests
 * US-207: Basic API testing
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('API Tests', () => {
  describe('Health Check', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Product Endpoints', () => {
    it('should get product by barcode', async () => {
      const res = await request(app).get('/api/products/barcode/3700123456789');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('name');
    });

    it('should return 404 for invalid barcode', async () => {
      const res = await request(app).get('/api/products/barcode/9999999999999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should search products', async () => {
      const res = await request(app).get('/api/products/search?q=cerave');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
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
      expect(res.body.data.score).toBeGreaterThan(0.7);
      expect(res.body.data.label).toBe('positive');
    });

    it('should analyze negative sentiment', async () => {
      const res = await request(app)
        .post('/api/sentiment/analyze')
        .send({ text: 'This is terrible. It caused a rash and irritation.' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.score).toBeLessThan(0.4);
      expect(res.body.data.label).toBe('negative');
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
  });

  describe('Recommendations', () => {
    it('should get recommendations', async () => {
      const res = await request(app).get('/api/recommendations?skinType=oily');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('should get trending products', async () => {
      const res = await request(app).get('/api/recommendations/trending');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should get budget recommendations', async () => {
      const res = await request(app).get('/api/recommendations/budget?maxPrice=20');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for invalid route', async () => {
      const res = await request(app).get('/api/invalid-route');
      expect(res.status).toBe(404);
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app).post('/api/sentiment/analyze').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});

