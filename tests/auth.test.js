const request = require('supertest');
const app = require('../src');
const faker = require('faker');
const models = require('../models');
const User = models.User;
const { setupDatabase, userOne } = require('./fixtures/db');

beforeEach(setupDatabase);

describe('signup test', () => {
  it('should not sign up when a input is empty', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: faker.name.firstName(),
        password: faker.internet.password()
      })
      .expect(500);
  });

  it('should not sign up if email has been already taken', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        name: faker.name.firstName(),
        email: userOne.email,
        password: faker.internet.password()
      });

    expect(response.text).toBe('This email has already been taken');
  });

  it('should be able to signup', async () => {
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const response = await request(app)
      .post('/api/signup')
      .send({
        name,
        email,
        password
      })
      .expect(201);
    expect(response.body.accessToken).not.toBeNull();
    expect(response.body.userId).toEqual(2);

    const user = await User.findOne({
      where: {
        email
      }
    });

    expect(name).toBe(user.name);
    expect(email).toBe(user.email);
    expect(password).not.toBe(user.password);
  });
});

describe('signin test', () => {
  it('should not signin when email is not found', async () => {
    const response = await request(app)
      .post('/api/signin')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password()
      });

    expect(response.text).toBe('User Not Found.');
  });

  it('should not signin when password is wrong', async () => {
    const response = await request(app)
      .post('/api/signin')
      .send({
        email: userOne.email,
        password: faker.internet.password()
      });

    expect(response.text).toBe('Invalid Password');
  });

  it('should be able to login', async () => {
    const { name, email, password } = userOne;
    const response = await request(app)
      .post('/api/signin')
      .send({
        email,
        password
      });

    expect(response.body.accessToken).not.toBeNull();
    expect(response.body.userId).toBe(userOne.id);

    const user = await User.findOne({
      where: {
        email
      }
    });

    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.password).not.toBe(password);
  });
});
