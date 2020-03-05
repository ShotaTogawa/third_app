const models = require("../../models");
const User = models.User;

exports.getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findAll({
      attributes: ["name", "image", "introduction", "createdAt"],
      where: { id: req.user.id }
    });
    if (!currentUser) {
      res.send("User not found");
    }
    return res.status(200).send(currentUser);
  } catch (e) {
    res.send(e);
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, introduction, imageUrl } = req.body;

  try {
    const profile = await User.findByPk(req.user.id);
    if (profile) {
      await profile
        .update({
          name,
          email,
          introduction,
          imageUrl
        })
        .save();
      return res.send(profile);
    }
  } catch (err) {
    return res.send(err);
  }
};
