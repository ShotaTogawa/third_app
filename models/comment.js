"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      user_id: DataTypes.INTEGER,
      photo_id: DataTypes.STRING,
      comment: DataTypes.STRING
    },
    {}
  );
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Photo, {
      foreignKey: "photo_id",
      onDelete: "CASCADE"
    });
  };
  return Comment;
};
