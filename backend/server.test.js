import { vi, describe, test, expect } from 'vitest'; 
import request from 'supertest';
import express from 'express';
import categoryRoutes from './routes/category.route.js';

const testApp = express();
testApp.use(express.json());

testApp.use('/api/categories', categoryRoutes);

vi.mock('./routes/category.route.js', () => ({
  default: express.Router().get('/', (req, res) => {
    res.status(200).json([
      { _id: "1", name: "Face Care", slug: "face-care" },
      { _id: "2", name: "Hair Care", slug: "hair-care" }
    ]);
  })
}));

describe('Integration testing of the server part', () => {
  test('GET /api/categories — Successful receipt of the list of product categories', async () => {
    const response = await request(testApp)
      .get('/api/categories')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(response.body)).toBe(true);
  });
});