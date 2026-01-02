import { test, expect } from '@playwright/test';

test.describe('API: dashboard and medals', () => {
  test('GET /api/dashboard-meta returns meta', async ({ request }) => {
    const res = await request.get('/api/dashboard-meta');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toHaveProperty('meta');
    expect(body.meta).toHaveProperty('title');
  });

  test('GET /api/dashboard-stats returns stats', async ({ request }) => {
    const res = await request.get('/api/dashboard-stats');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toHaveProperty('stats');
    expect(body.stats).toHaveProperty('totalAthletes');
    expect(typeof body.stats.totalAthletes).toBe('number');
  });

  test('Medals CRUD: POST, GET, PUT, DELETE', async ({ request }) => {
    // Create
    const newMedal = {
      athleteId: 'test-athlete',
      sportId: 'test-sport',
      eventId: 'evt-1',
      athleteName: 'Test Athlete',
      sportName: 'Test Sport',
      medalType: 'bronze',
      province: 'Test Province',
      awardedDate: '2025-12-31',
    };

    const postRes = await request.post('/api/medals', { data: newMedal });
    expect(postRes.status()).toBe(201);
    const postBody = await postRes.json();
    expect(postBody).toHaveProperty('medal');
    const id = postBody.medal.id;

    // GET - should include the created medal
    const getRes = await request.get('/api/medals');
    expect(getRes.ok()).toBeTruthy();
    const getBody = await getRes.json();
    expect(getBody.medals.some((m: any) => m.id === id)).toBeTruthy();

    // PUT - update
    const updated = { id, province: 'Updated Province' };
    const putRes = await request.put('/api/medals', { data: updated });
    expect(putRes.ok()).toBeTruthy();
    const putBody = await putRes.json();
    expect(putBody.medal.province).toBe('Updated Province');

    // DELETE
    const delRes = await request.delete('/api/medals', { data: { id } });
    expect(delRes.ok()).toBeTruthy();
    const delBody = await delRes.json();
    expect(delBody.success).toBeTruthy();
  });
});
