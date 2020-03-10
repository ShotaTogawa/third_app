'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            mas: 'Name is required'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: {
            args: true,
            mas: 'Email is required'
          },
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            mas: 'Password is required'
          },
          min: 6
        }
      },
      image: {
        type: DataTypes.STRING
      },
      introduction: {
        type: DataTypes.STRING,
        validate: {
          max: {
            args: 255,
            mas: 'Max length is 255'
          }
        }
      }
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Photo, {
      foreignKey: 'user_id'
    });

    User.hasMany(models.Comment, {
      foreignKey: 'user_id'
    });

    User.belongsToMany(models.Photo, {
      through: 'Likes',
      as: 'photos',
      foreignKey: 'user_id',
      timestamps: true
    });

    User.belongsToMany(models.User, {
      through: 'Follow',
      foreignKey: 'followee_id',
      as: 'follower',
      timestamps: true
    });

    User.belongsToMany(models.User, {
      through: 'Follow',
      foreignKey: 'follower_id',
      as: 'followee',
      timestamps: true
    });
  };

  return User;
};
