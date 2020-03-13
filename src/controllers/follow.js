const models = require('../../models');
const Follow = models.Follow;

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
