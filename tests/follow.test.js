const request = require('supertest');
const app = require('../src');
const models = require('../models');
const Follow = models.Follow;
const { setupDatabase, userOne, userTwo, userFour } = require('./fixtures/db');
const TestUtils = require('./fixtures/testUtils.js');

beforeEach(setupDatabase);

describe('follow controller tests', () => {
  it('should get followers', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/follower`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.body.length).toEqual(2);
  });

  it('should return a message when the user is not followed by other users', async () => {
    const auth = await TestUtils.login(userFour.email, userFour.password);
    const response = await request(app)
      .get(`/api/follower`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.text).toBe('No followers');
  });

  it('should get followees', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/followee`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.body.length).toEqual(1);
  });

  it('should return a message when the user have not followed other users', async () => {
    const auth = await TestUtils.login(userFour.email, userFour.password);
    const response = await request(app)
      .get(`/api/followee`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.text).toBe("Haven't followed anyone yet");
  });

  it('should follow', async () => {
    const auth = await TestUtils.login(userFour.email, userFour.password);
    const response = await request(app)
      .post(`/api/follow/${userOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const follow = await Follow.findOne({
      where: {
        follower_id: response.body.follower_id,
        followee_id: response.body.followee_id
      }
    });

    expect(follow).not.toBeNull();
    expect(follow.followee_id).toBe(userFour.id);
    expect(follow.follower_id).toBe(userOne.id);
  });

  it('should unfollow', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    await request(app)
      .delete(`/api/unfollow/${userTwo.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const follow = await Follow.findOne({
      where: {
        followee_id: userOne.id,
        follower_id: userTwo.id
      }
    });

    expect(follow).toBeNull();
  });
});
