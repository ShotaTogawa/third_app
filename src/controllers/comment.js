const models = require('../../models');
const Comment = models.Comment;

exports.comments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        photo_id: req.params.photoId
      }
    });
    if (comments.length === 0) {
      return res.send('No comments');
    }
    res.send(comments);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.createComment = async (req, res) => {
  const { comment } = req.body;
  try {
    if (!comment) {
      return res.send('Comment is required');
    }
    console.log(req.params);
    const newComment = await Comment.create({
      user_id: req.user.id,
      photo_id: req.params.photoId,
      comment
    });
    if (!newComment) {
      return res.send('Failed to create a comment');
    }
    res.send(newComment);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.send('Not Found');
    }
    await comment.update({
      comment: req.body.comment || comment.comment
    });
    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.destroy({
      where: { id: parseInt(req.params.commentId) }
    });
    if (!comment) {
      return res.send('Failed to delete');
    }
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e);
  }
};
