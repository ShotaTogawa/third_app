const models = require("../../models");
const Photo = models.Photo;
const { Op } = require("sequelize");

exports.getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findAll({
      where: {
        id: req.params.photoId
      }
    });
    if (!photo) {
      res.send("the photo is not found");
    }
    res.send(photo);
  } catch (e) {
    res.send(e);
  }
};

exports.getMyPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      where: {
        user_id: req.user.id
      },
      limit: parseInt(req.query.limit),
      offset: parseInt(req.query.offset)
    });
    if (!photos) {
      res.send("This user does not have photos");
    }
    res.send(photos);
  } catch (e) {
    res.send(e);
  }
};

exports.getSearchMyPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      attributes: ["id", "user_id", "photo_url", "description", "createdAt"],
      where: {
        user_id: req.user.id,
        description: {
          [Op.like]: `%${req.query.term}%`
        }
      }
    });
    if (!photos) {
      res.send("Not found");
    }
    res.send(photos);
  } catch (e) {
    res.send(e);
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      limit: parseInt(req.query.limit),
      offset: parseInt(req.query.offset)
    });
    if (!photos) {
      res.send("This user does not have photos");
    }
    res.send(photos);
  } catch (e) {
    res.send(e);
  }
};

exports.getSearchPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      attributes: ["id", "user_id", "photo_url", "description", "createdAt"],
      where: {
        description: {
          [Op.like]: `%${req.query.term}%`
        }
      }
    });
    if (!photos) {
      res.send("Not found");
    }
    res.send(photos);
  } catch (e) {
    res.send(e);
  }
};

exports.postPhoto = async (req, res) => {
  const { photoUrl, description } = req.body;
  try {
    const photo = await Photo.create({
      user_id: req.user.id,
      photo_url: photoUrl,
      description
    });
    if (!photo) {
      res.send("Something wrong");
    }
    res.send(photo);
  } catch (e) {
    res.send(e);
  }
};

exports.putPhoto = async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.photoId);

    if (photo) {
      await photo
        .update({
          description: req.body.description
        })
        .save();
    }
    res.send(photo);
  } catch (err) {
    return res.send(err);
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    await Photo.destroy({
      where: { id: parseInt(req.params.photoId) }
    });
    res.sendStatus(200);
  } catch (e) {
    res.send("Failed to delete");
  }
};
