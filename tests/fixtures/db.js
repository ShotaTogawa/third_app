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
};

module.exports = {
  setupDatabase,
  userOne
};
