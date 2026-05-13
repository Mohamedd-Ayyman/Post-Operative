import requests from 'supertest';

const BASE = process.env.ML_BASE || 'http://localhost:5000';

describe('ML Service Endpoints', () => {
  it('GET /health returns status ok', async () => {
    const res = await requests(BASE).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('model_loaded');
  });

  it('POST /predict returns valid risk for normal inputs', async () => {
    const res = await requests(BASE)
      .post('/predict')
      .send({
        painLevel: 2,
        temperature: 37.0,
        redness: 0,
        swelling: 0,
        discharge: 'none',
        daysSinceSurgery: 14,
        activityLevel: 'normal',
        smoking: false,
        diabetes: false,
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('riskLevel');
    expect(res.body).toHaveProperty('confidence');
    expect(res.body).toHaveProperty('probabilities');
    expect(['normal', 'moderate', 'high']).toContain(res.body.riskLevel);
  });

  it('POST /predict returns high risk for severe symptoms', async () => {
    const res = await requests(BASE)
      .post('/predict')
      .send({
        painLevel: 9,
        temperature: 38.8,
        redness: 4,
        swelling: 3,
        discharge: 'severe',
        daysSinceSurgery: 3,
        activityLevel: 'bedridden',
        smoking: true,
        diabetes: true,
      });
    expect(res.status).toBe(200);
    expect(res.body.riskLevel).toBe('high');
    expect(res.body.confidence).toBeGreaterThan(0.5);
  });

  it('POST /predict has all probability keys', async () => {
    const res = await requests(BASE)
      .post('/predict')
      .send({
        painLevel: 5, temperature: 37.5, redness: 1, swelling: 1,
        discharge: 'mild', daysSinceSurgery: 7, activityLevel: 'low',
        smoking: false, diabetes: false,
      });
    expect(res.status).toBe(200);
    expect(res.body.probabilities).toHaveProperty('normal');
    expect(res.body.probabilities).toHaveProperty('moderate');
    expect(res.body.probabilities).toHaveProperty('high');
  });
});