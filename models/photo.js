'use strict';
// const { myPhotosQuery } = require('../src/sql/photos');
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');

class Photo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
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
      {
        timestamps: true,
        sequelize
      }
    );
  }

  static buildMyPhotosQuery(userId, limit, offset) {
    const photos = Sequelize.query(
      `select
          photo.id,
          photo.user_id,
          photo.photo_url,
          photo.description,
          case
              when counter.likeCount is Null
          then 0
          else
              counter.likeCount
          end likeCount,
          case
              when photo.id in (select photo_id from likes where user_id = :user_id)
                  then 1
              else
                  0
          end as isLiked
      from
          photos photo
      left join
          (select
              photo_id,
              count(user_id) likeCount
          from
              likes
          group by
              photo_id
          ) counter
      on photo.id = counter.photo_id
      where photo.user_id = :user_id
      limit :offset, :limit`,
      {
        replacements: { user_id: userId, limit, offset },
        type: QueryTypes.SELECT
      }
    );
    return photos;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.Comment, {
      foreignKey: 'photo_id',
      as: 'comments'
    });

    this.belongsToMany(models.User, {
      through: 'Likes',
      as: 'users',
      foreignKey: 'photo_id',
      timestamps: true
    });
  }
}

module.exports = Photo;

// module.exports = (sequelize, DataTypes) => {
//   const Photo = sequelize.define(
//     'Photo',
//     {
//       user_id: DataTypes.INTEGER,
//       photo_url: {
//         type: DataTypes.STRING,
//         validate: {
//           notEmpty: true
//         }
//       },
//       description: {
//         type: DataTypes.STRING,
//         validate: {
//           max: 255
//         }
//       }
//     },
//     {}
//   );
//   Photo.associate = function(models) {
//     // associations can be defined here
//     Photo.belongsTo(models.User, {
//       foreignKey: 'user_id',
//       onDelete: 'CASCADE'
//     });

//     Photo.hasMany(models.Comment, {
//       foreignKey: 'photo_id',
//       as: 'comments'
//     });

//     Photo.belongsToMany(models.User, {
//       through: 'Likes',
//       as: 'users',
//       foreignKey: 'photo_id',
//       timestamps: true
//     });
//   };

//   Photo.prototype.buildMyPhotosQuery = async (userId, limit, offset) => {
//     const photos = await sequelize.query(myPhotosQuery, {
//       replacements: { user_id: userId, limit, offset },
//       type: QueryTypes.SELECT
//     });
//     return photos;
//   };
//   return Photo;
// };
