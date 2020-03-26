const faker = require('faker');
const models = require('../../models');
const bcrypt = require('bcryptjs');
const User = models.User;
const Photo = models.Photo;
const Comment = models.Comment;
const Like = models.Like;
const Follow = models.Follow;

const userOne = {
  id: 1,
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

const userTwo = {
  id: 2,
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

const userThree = {
  id: 3,
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

const photoOne = {
  id: 1,
  user_id: userOne.id,
  description:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  photo_url: 'photo_url_1'
};

const photoTwo = {
  id: 2,
  user_id: userOne.id,
  description:
    'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form,',
  photo_url: 'photo_url_1'
};

const commentOne = {
  id: 1,
  user_id: userOne.id,
  photo_id: photoOne.id,
  comment: 'first comment'
};

const commentTwo = {
  id: 2,
  user_id: userTwo.id,
  photo_id: photoOne.id,
  comment: 'second comment'
};

const likeOne = {
  id: 1,
  user_id: userTwo.id,
  photo_id: photoOne.id
};

const likeTwo = {
  id: 2,
  user_id: userThree.id,
  photo_id: photoOne.id
};

const followOne = {
  id: 1,
  followee_id: userOne.id,
  follower_id: userTwo.id
};

const followTwo = {
  id: 2,
  followee_id: userTwo.id,
  follower_id: userOne.id
};

const followThree = {
  id: 3,
  followee_id: userThree.id,
  follower_id: userOne.id
};

const setupDatabase = async () => {
  await User.truncate();
  await Photo.truncate();
  await Comment.truncate();
  await Like.truncate();
  await Follow.truncate();
  await User.create({
    name: userOne.name,
    email: userOne.email,
    password: bcrypt.hashSync(userOne.password, 10)
  });
  await User.create({
    name: userTwo.name,
    email: userTwo.email,
    password: bcrypt.hashSync(userTwo.password, 10)
  });

  await User.create({
    name: userThree.name,
    email: userThree.email,
    password: bcrypt.hashSync(userThree.password, 10)
  });

  await Photo.create(photoOne);
  await Photo.create(photoTwo);
  await Comment.create(commentOne);
  await Comment.create(commentTwo);
  await Like.create(likeOne);
  await Like.create(likeTwo);
  await Follow.create(followOne);
  await Follow.create(followTwo);
  await Follow.create(followThree);
};

module.exports = {
  setupDatabase,
  userOne
};
