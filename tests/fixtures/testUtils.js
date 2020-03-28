const request = require('supertest');
const app = require('../../src');

class TestUtils {
  static async login(email, password) {
    const response = await request(app)
      .post('/api/signin')
      .send({
        email,
        password
      });
    return response.body;
  }
}

module.exports = TestUtils;
