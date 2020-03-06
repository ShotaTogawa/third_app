const models = require("../../models");
const User = models.User;
const { Op } = require("sequelize");

exports.currentUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      attributes: ["name", "email", "image", "introduction", "createdAt"],
      where: { id: req.user.id }
    });
    if (!currentUser) {
      return res.send("User not found");
    }
    return res.status(200).send(currentUser);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["name", "image", "introduction", "createdAt"],
      limit: req.query.limit,
      offset: req.query.offset
    });
    if (!users) {
      return res.send("User Not found");
    }
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "image", "introduction", "createdAt"],
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
    if (!users) {
      return res.send("User Not found");
    }
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, introduction, imageUrl } = req.body;

  try {
    const profile = await User.findByPk(req.user.id);
    if (profile) {
      await profile
        .update({
          name: name || profile.name,
          email: email || profile.email,
          introduction,
          imageUrl
        })
        .save();
      return res.send(profile);
    }
  } catch (e) {
    return res.status(500).send(e);
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
      return res.send("Failed to delete");
    }
    res.send(user);
  } catch (e) {
    return res.status(500).send(e);
  }
};
