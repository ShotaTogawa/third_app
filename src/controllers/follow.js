const models = require('../../models');
const Follow = models.Follow;
const User = models.User;

exports.follow = async (req, res) => {
  try {
    const follow = await Follow.create({
      followee_id: req.user.id,
      follower_id: req.params.userId
    });
    if (!follow) return res.send('Failed to follow');
    res.send(follow);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.unfollow = async (req, res) => {
  try {
    await Follow.destroy({
      where: {
        followee_id: req.user.id,
        follower_id: req.params.userId
      }
    });
    res.send(200);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.followers = async (req, res) => {
  try {
    const followers = await Follow.findAll({
      where: {
        follower_id: req.user.id
      }
    });

    const followerIds = await followers.map(follower => {
      return follower.dataValues.followee_id;
    });

    const users = await User.findAll({
      where: {
        id: followerIds
      }
    });

    if (users.length === 0) {
      res.send('No followers');
    }

    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.followees = async (req, res) => {
  try {
    const followees = await Follow.findAll({
      where: {
        followee_id: req.user.id
      }
    });

    const followeeIds = await followees.map(followee => {
      return followee.dataValues.follower_id;
    });

    const users = await User.findAll({
      where: {
        id: followeeIds
      }
    });
    if (users.length === 0) {
      res.send("Haven't followed anyone yet");
    }

    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};
