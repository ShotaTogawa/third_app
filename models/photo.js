'use strict';
const { myPhotosQuery } = require('../src/sql/myphotos');
const { QueryTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define(
    'Photo',
    {
      user_id: DataTypes.INTEGER,
      photo_url: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          max: 255
        }
      }
    },
    {}
  );
  Photo.associate = function(models) {
    // associations can be defined here
    Photo.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    Photo.hasMany(models.Comment, {
      foreignKey: 'photo_id',
      as: 'comments'
    });

    Photo.belongsToMany(models.User, {
      through: 'Likes',
      as: 'users',
      foreignKey: 'photo_id',
      timestamps: true
    });
  };

  Photo.prototype.buildMyPhotosQuery = async (user_id, limit, offset) => {
    const photos = await sequelize.query(myPhotosQuery, {
      replacements: { user_id: user_id, limit, offset },
      type: QueryTypes.SELECT
    });
    return photos;
  };
  return Photo;
};
