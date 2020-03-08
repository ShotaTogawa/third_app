const models = require('../../models');
const User = models.User;
const { Op } = require('sequelize');

exports.currentUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      attributes: ['name', 'email', 'image', 'introduction', 'createdAt'],
      where: { id: req.user.id }
    });
    if (!currentUser) {
      return res.send('User not found');
    }
    return res.status(200).send(currentUser);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.users = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['name', 'image', 'introduction', 'createdAt'],
      limit: parseInt(req.query.limit),
      offset: parseInt(req.query.offset)
    });
    if (users.length === 0) {
      return res.send('Not found');
    }
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'image', 'introduction', 'createdAt'],
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${req.query.term}%`
            }
          },
          {
            introduction: {
              [Op.like]: `%${req.query.term}%`
            }
          }
        ]
      }
    });
    if (users.length === 0) {
      return res.send('Not Found');
    }
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, introduction, image } = req.body;
  console.log('image url', image);

  try {
    const profile = await User.findByPk(req.user.id);
    if (!profile) {
      return res.send('Profile Not Found');
    }
    await profile.update({
      name: name || profile.name,
      email: email || profile.email,
      introduction,
      image
    });
    res.send(profile);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.destroy({
      where: {
        id: req.user.id
      }
    });
    if (!user) {
      return res.send('Failed to delete a user');
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
};
