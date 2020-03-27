const request = require('supertest');
const app = require('../src');
const models = require('../models');
const User = models.User;
const {
  setupDatabase,
  userOne,
  userFour,
  photoOne,
  photoTwo
} = require('./fixtures/db');
const TestUtils = require('./fixtures/testUtils.js');

beforeEach(setupDatabase);

describe('user controller test', () => {
  it('should get a current user', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const user = await User.findByPk(response.body.id);
    expect(response.body.email).toBe(user.email);
    expect(response.body.name).toBe(user.name);
  });
});
