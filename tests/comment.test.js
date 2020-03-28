const request = require('supertest');
const app = require('../src');
const models = require('../models');
const Comment = models.Comment;
const {
  setupDatabase,
  userOne,
  photoOne,
  commentOne
} = require('./fixtures/db');
const TestUtils = require('./fixtures/testUtils.js');

beforeEach(setupDatabase);

describe('comment controller tests', () => {
  const invalidId = 100;

  it('should get comments which belong to a photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/comment/${photoOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body.length).toEqual(2);
  });

  it('should not get comments with a invalid photoId', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/comment/${invalidId}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.text).toBe('No comments');
  });

  it('should craete a new comment', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .post(`/api/comment/${photoOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .send({
        comment: 'new comment'
      })
      .expect(200);
    const comment = await Comment.findByPk(response.body.id);
    expect(comment.comment).not.toBeNull();
    expect(comment.comment).toBe('new comment');
  });

  it('should not craete a comment with no comment', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    await request(app)
      .post(`/api/comment/${photoOne.id}`)
      .send({
        comment: ''
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(422);
  });

  it('should update a comment content', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .put(`/api/comment/${commentOne.id}`)
      .send({
        comment: 'update a content'
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    const comment = await Comment.findByPk(response.body.id);
    expect(response.body.comment).toBe(comment.comment);
  });

  it('should not update a comment content with an unexisiting commentId', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .put(`/api/comment/${invalidId}`)
      .send({
        comment: 'update a content'
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);

    expect(response.text).toBe('Not Found');
  });

  it('should delete a comment', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    await request(app)
      .delete(`/api/comment/${commentOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    const comment = await Comment.findByPk(commentOne.id);
    expect(comment).toBeNull();
  });

  it('should not be able to delete a comment with an invalid commentId', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .delete(`/api/comment/${invalidId}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.text).toBe('Failed to delete');
  });
});
