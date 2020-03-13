const models = require('../../models');
const Like = models.Like;
const sequelize = require('../../db/database');

exports.like = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: { user_id: req.user.id, photo_id: req.params.photoId }
    });

    const likes = await Like.findAll({
      where: {
        photo_id: req.params.photoId
      },
      attributes: [
        'photo_id',
        [sequelize.fn('COUNT', sequelize.col('user_id')), 'likes']
      ],
      group: 'photo_id'
    });

    return res.status(200).send([like, likes]);
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.createLike = async (req, res) => {
  try {
    const like = await Like.create({
      user_id: req.user.id,
      photo_id: req.params.photoId
    });
    if (!like) {
      return res.send('Failed to like');
    }
    const likes = await Like.findAll({
      where: {
        photo_id: req.params.photoId
      },
      attributes: [
        'photo_id',
        [sequelize.fn('COUNT', sequelize.col('user_id')), 'likes']
      ],
      group: 'photo_id'
    });
    res.status(201).send(likes);
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.unlike = async (req, res) => {
  try {
    const like = await Like.destroy({
      where: { user_id: req.user.id, photo_id: req.params.photoId }
    });
    if (!like) return res.send('Failed to unlike');
    const likes = await Like.findAll({
      where: {
        photo_id: req.params.photoId
      },
      attributes: [
        'photo_id',
        [sequelize.fn('COUNT', sequelize.col('user_id')), 'likes']
      ],
      group: 'photo_id'
    });
    res.status(200).send(likes);
  } catch (e) {
    res.status(500).send(e);
  }
};