const request = require('supertest');
const app = require('../src');
const models = require('../models');
const User = models.User;
const { setupDatabase, userOne, userTwo } = require('./fixtures/db');
const TestUtils = require('./fixtures/testUtils.js');

beforeEach(setupDatabase);

describe('user controller test', () => {
  const invalidId = 100;

  it('should get a current user', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const user = await User.findOne({
      where: {
        email: response.body[0].email
      }
    });
    expect(response.body[0].name).toBe(user.name);
    expect(response.body[0].Photos[0].posts).toEqual(3);
    expect(response.body[1].followee.length).toEqual(1);
    expect(response.body[2].follower.length).toEqual(2);
  });

  it('should get a specific user', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/user/${userTwo.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const user = await User.findOne({
      where: {
        email: response.body[0].email
      }
    });
    expect(response.body[0].name).toBe(user.name);
    expect(response.body[0].Photos[0].posts).toEqual(1);
    expect(response.body[1].followee.length).toEqual(1);
    expect(response.body[2].follower.length).toEqual(1);
  });

  it('should not get any user wiht an invalid userId', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/user/${invalidId}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.text).toBe('User not found');
  });

  it('should get users', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/users/?limit=10&offset=0`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.body.length).toEqual(3);
  });

  it('should get users if a search term matches a user name or the introduction', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/user-search/?term=${userTwo.name}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.body.length).toEqual(1);

    const res = await request(app)
      .get(`/api/user-search/?term=Hello`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(res.body.length).toEqual(2);
  });

  it('should not get any user if a search term does not matche user name or the introduction', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/user-search/?term=invalidTerm`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.text).toEqual('Not Found');
  });

  it('should update user info', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .patch(`/api/user/edit`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .send({
        introduction: 'updated',
        image: 'image url'
      })
      .expect(200);

    const user = await User.findByPk(userOne.id);

    expect(response.body.email).toEqual(user.email);
    expect(response.body.name).toEqual(user.name);
    expect(response.body.introduction).toEqual(user.introduction);
    expect(response.body.image).toEqual(user.image);
  });

  it('should delete a current user', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    await request(app)
      .delete(`/api/user`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const user = await User.findByPk(userOne.id);

    expect(user).toBeNull();
  });
});
