"use strict";
module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define(
    "Photo",
    {
      user_id: DataTypes.INTEGER,
      photo_url: DataTypes.STRING
    },
    {}
  );
  Photo.associate = function(models) {
    // associations can be defined here
    Photo.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE"
    });

    Photo.hasMany(models.Comment, {
      foreignKey: "photo_id",
      as: "comments"
    });

    Photo.belongsToMany(models.User, {
      through: "Likes",
      as: "users",
      foreignKey: "photo_id",
      timestamps: true
    });
  };
  return Photo;
};
