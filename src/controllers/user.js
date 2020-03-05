const models = require('../../models')
const User = models.User

exports.updateProfile = async (req, res) => {
  const { name, email, introduction, imageUrl } = req.body

  try {
    const profile = await User.findByPk(req.user.id)
    if (profile) {
      await profile
        .update({
          name,
          email,
          introduction,
          imageUrl
        })
        .save()
      return res.send(profile)
    }
  } catch (err) {
    return res.send(err)
  }
}
