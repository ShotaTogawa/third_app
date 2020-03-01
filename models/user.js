"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Photo, {
      foreignKey: "user_id",
      as: "photos"
    });

    User.belongsToMany(models.Photo, {
      through: "Likes",
      as: "photos",
      foreignKey: "user_id",
      timestamps: true
    });

    User.belongsToMany(models.User, {
      through: "Follow",
      foreignKey: "followee_id",
      timestamps: true
    });

    User.belongsToMany(models.User, {
      through: "Follow",
      foreignKey: "follower_id",
      timestamps: true
    });
  };
  return User;
};
