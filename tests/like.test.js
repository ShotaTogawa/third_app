const request = require('supertest');
const app = require('../src');
const models = require('../models');
const Like = models.Like;
const {
  setupDatabase,
  userOne,
  userFour,
  photoOne,
  photoTwo
} = require('./fixtures/db');
const TestUtils = require('./fixtures/testUtils.js');

beforeEach(setupDatabase);

describe('like controller tests', () => {
  const invalidId = 100;

  it('should get likes with a valid photoId', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/like/${photoOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    console.log(response.body);
    expect(response.body[0]).not.toBeNull();
    expect(response.body[1][0].likes).toEqual(3);
  });

  it('should not get likes with an invalid photoId', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/like/${invalidId}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.text).toBe('Not found the photo');
  });

  it('should like to a photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const res = await request(app)
      .get(`/api/like/${photoTwo.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const prevLikes = res.body[1][0].likes;

    const response = await request(app)
      .post(`/api/like/${photoTwo.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(201);
    expect(response.body[0].likes).toEqual(prevLikes + 1);
  });

  it('should fail to like a photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .post(`/api/like/${invalidId}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.text).toBe('Not found the photo');
  });

  it('should unlike a photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const res = await request(app)
      .get(`/api/like/${photoOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const prevLikes = res.body[1][0].likes;

    const response = await request(app)
      .delete(`/api/unlike/${photoOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const like = await Like.findOne({
      where: {
        user_id: userOne.id,
        photo_id: photoOne.id
      }
    });

    expect(like).toBeNull();
    expect(response.body[0].likes).toEqual(prevLikes - 1);
  });

  it('should fail to unlike a photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .delete(`/api/unlike/${invalidId}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.text).toBe('Not found the photo');
  });

  it('should get favorite photos', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/favorites/?limit=10&offset=0`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.body[0].length).toEqual(2);
    expect(response.body[1].count).toEqual(2);
  });

  it('should not get favorite photos if the user have not liked yet', async () => {
    const auth = await TestUtils.login(userFour.email, userFour.password);
    const response = await request(app)
      .get(`/api/favorites/?limit=10&offset=0`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.body[0]).toBe('You do not have favorite photos');
    expect(response.body[1]).toEqual(0);
  });
});
