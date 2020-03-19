const models = require('../../models');
const Photo = models.Photo;
const User = models.User;
const { Op } = require('sequelize');

exports.photo = async (req, res) => {
  try {
    const photo = await Photo.findOne({
      where: {
        id: parseInt(req.params.photoId)
      },
      include: [
        {
          model: User,
          required: true,
          attributes: ['name', 'image']
        }
      ]
    });
    if (!photo) {
      return res.send('the photo is not found');
    }
    res.send(photo);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.myPhotos = async (req, res) => {
  try {
    const photos = await Photo.findUserPhotos(
      parseInt(req.user.id),
      parseInt(req.query.limit),
      parseInt(req.query.offset)
    );
    if (photos.length === 0) {
      return res.send('You do not have photos');
    }
    res.send(photos);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.otherUserPhotos = async (req, res) => {
  try {
    const photos = await Photo.findUserPhotos(
      parseInt(req.params.userId),
      parseInt(req.query.limit),
      parseInt(req.query.offset)
    );

    if (photos.length === 0) {
      return res.send('No photos');
    }
    res.send(photos);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.searchMyPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      attributes: ['id', 'user_id', 'photo_url', 'description', 'createdAt'],
      where: {
        user_id: req.user.id,
        description: {
          [Op.like]: `%${req.query.term}%`
        }
      }
    });
    if (photos.length === 0) {
      return res.send('Not found');
    }
    res.send(photos);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.photos = async (req, res) => {
  try {
    const photos = await Photo.findPublicPhotos(
      parseInt(req.user.id),
      parseInt(req.query.limit),
      parseInt(req.query.offset)
    );

    if (photos.length === 0) {
      return res.send('This user does not have photos');
    }
    res.send(photos);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.searchPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      attributes: ['id', 'user_id', 'photo_url', 'description', 'createdAt'],
      where: {
        description: {
          [Op.like]: `%${req.query.term}%`
        }
      },
      include: [
        {
          model: User,
          required: true,
          attributes: ['name', 'image']
        }
      ]
    });
    if (photos.length === 0) {
      return res.send('Not found');
    }
    res.send(photos);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createPhoto = async (req, res) => {
  const { photoUrl, description } = req.body;
  try {
    if (!photoUrl) {
      return res.send('Photo has to be sent');
    }
    const photo = await Photo.create({
      user_id: req.user.id,
      photo_url: photoUrl,
      description
    });
    if (!photo) {
      return res.send('Failed to create a photo');
    }
    res.send(photo);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.photoId);

    if (!photo) {
      return res.send('Not Found');
    }
    await photo.update({
      description: req.body.description || photo.description
    });
    return res.send(photo);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.destroy({
      where: { id: parseInt(req.params.photoId) }
    });
    if (!photo) {
      return res.send('Failed to delete');
    }
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e);
  }
};
