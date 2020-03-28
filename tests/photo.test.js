const request = require('supertest');
const app = require('../src');
const models = require('../models');
const Photo = models.Photo;
const { setupDatabase, userOne, photoOne } = require('./fixtures/db');
const TestUtils = require('./fixtures/testUtils.js');

beforeEach(setupDatabase);

describe('Photo test', () => {
  it('should get a specific photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/photo/${photoOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body.user_id).toBe(userOne.id);
    expect(response.body.photo_url).toBe(photoOne.photo_url);
  });

  it('should not get any photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const inValidPhotoId = 100;
    const response = await request(app)
      .get(`/api/photo/${inValidPhotoId}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.text).toBe('the photo is not found');
  });

  it('should get my photos', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/my-photos/?limit=12&offset=0`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body.length).toEqual(3);
  });

  it('should get my two photos before paginated ', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/my-photos/?limit=2&offset=0`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body.length).toEqual(2);
  });

  it('should get my photo after paginated ', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/my-photos/?limit=2&offset=2`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body.length).toEqual(1);
  });

  it('should get public photos', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/photos/?limit=12&offset=0`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body[0].length).toEqual(4);
    expect(response.body[1].count).toEqual(4);
  });

  it('should get three public photos before paginated ', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/photos/?limit=3&offset=0`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body[0].length).toEqual(3);
    expect(response.body[1].count).toEqual(4);
  });

  it('should get a public photo before paginated ', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/photos/?limit=3&offset=3`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body[0].length).toEqual(1);
    expect(response.body[1].count).toEqual(4);
  });

  it('should get search result with query string which is "printing" from my photos', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/my-photos/search/?term=printing`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body.length).toEqual(1);
  });

  it('should not get any search result with query string which is "noterm" from my photos', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/my-photos/search/?term=noterm`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.text).toBe('Not found');
  });

  it('should get search result with query string which is "userTwo" from my photos', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/photo-search/?term=printing`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.body.length).toEqual(1);
  });

  it('should not get any search result with query string which is "noterm" from my photos', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .get(`/api/photo-search/?term=noterm`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    expect(response.text).toBe('Not found');
  });

  it('should create a photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .post('/api/photo')
      .send({
        photoUrl: 'newPhoto',
        description: 'succeded to insert a photo'
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    const photo = await Photo.findByPk(response.body.id);

    expect(photo.dataValues.photo_url).toBe('newPhoto');
    expect(photo.dataValues.description).toBe('succeded to insert a photo');
  });

  it('should not create a photo if photoUrl is empty', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    const response = await request(app)
      .post('/api/photo')
      .send({
        photoUrl: '',
        description: 'succeded to insert a photo'
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(422);
    const photo = await Photo.findByPk(response.body.id);

    expect(photo).toBeNull();
  });

  it('should update description of the photo', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    await request(app)
      .put(`/api/photo/${photoOne.id}`)
      .send({
        description: 'succeded to update description'
      })
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    const photo = await Photo.findByPk(photoOne.id);

    expect(photo.dataValues.description).toBe('succeded to update description');
  });

  it('should delete photoOne data', async () => {
    const auth = await TestUtils.login(userOne.email, userOne.password);
    await request(app)
      .delete(`/api/photo/${photoOne.id}`)
      .set('Authorization', `Bearer ${auth.accessToken}`)
      .expect(200);
    const photo = await Photo.findByPk(photoOne.id);

    expect(photo).toBeNull();
  });
});
