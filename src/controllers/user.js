const models = require('../../models')
const User = models.User
const { Op } = require('sequelize')

exports.getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findAll({
      attributes: ['name', 'image', 'introduction', 'createdAt'],
      where: { id: req.user.id }
    })
    if (!currentUser) {
      res.send('User not found')
    }
    return res.status(200).send(currentUser)
  } catch (e) {
    res.send(e)
  }
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['name', 'image', 'introduction', 'createdAt'],
      limit: parseInt(req.query.limit),
      offset: req.query.offset
    })
    res.send(users)
  } catch (e) {
    res.send(e)
  }
}

exports.getSearchUsers = async (req, res) => {
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
    })
    res.send(users)
  } catch (e) {
    res.send(e)
  }
}

exports.updateProfile = async (req, res) => {
  const { name, email, introduction, imageUrl } = req.body

  try {
    const profile = await User.findByPk(req.user.id)
    if (profile) {
      await profile
        .update({
          name: name || profile.name,
          email: email || profile.email,
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

exports.deleteUser = async (req, res) => {
  const user = await User.destroy({
    where: {
      id: req.user.id
    }
  })
  res.send(user)
}
