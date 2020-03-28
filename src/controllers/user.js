const models = require('../../models');
const User = models.User;
const Photo = models.Photo;
const Follow = models.Follow;
const { Op } = require('sequelize');
const sequelize = require('../../db/database');

exports.currentUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      attributes: ['name', 'email', 'image', 'introduction', 'createdAt'],
      where: { id: req.user.id },
      include: [
        {
          model: Photo,
          required: true,
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('user_id')), 'posts']
          ],
          group: 'id'
        }
      ]
    });

    const followers = await Follow.findAll({
      where: {
        followee_id: req.user.id
      },
      attributes: ['follower_id']
    });

    const followIds = await followers.map(follower => {
      return follower.dataValues.follower_id;
    });

    const follows = await Follow.findAll({
      where: {
        follower_id: req.user.id
      },
      attributes: ['followee_id']
    });
    const followerIds = await follows.map(follow => {
      return follow.dataValues.followee_id;
    });

    if (!currentUser) {
      return res.send('User not found');
    }
    return res
      .status(200)
      .send([currentUser, { followee: followIds }, { follower: followerIds }]);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.user = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'image', 'introduction', 'createdAt'],
      include: [
        {
          model: Photo,
          required: true,
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('user_id')), 'posts']
          ],
          group: 'id'
        }
      ]
    });

    if (!user.dataValues.id) {
      return res.send('User not found');
    }

    const followers = await Follow.findAll({
      where: {
        followee_id: req.params.id
      },
      attributes: ['follower_id']
    });

    const followerIds = await followers.map(follower => {
      return follower.dataValues.follower_id;
    });

    const follows = await Follow.findAll({
      where: {
        follower_id: req.params.id
      },
      attributes: ['followee_id']
    });
    const followIds = await follows.map(follow => {
      return follow.dataValues.followee_id;
    });

    return res
      .status(200)
      .send([user, { followee: followIds }, { follower: followerIds }]);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.users = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'image', 'introduction', 'createdAt'],
      where: {
        id: { [Op.notIn]: [req.user.id] }
      },
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

  try {
    const profile = await User.findByPk(req.user.id);
    if (!profile) {
      return res.send('User Not Found');
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
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
};
