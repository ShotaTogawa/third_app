'use strict';
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

  Photo.findUserPhotos = async (userId, limit, offset) => {
    const photos = await sequelize.query(
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
  };

  Photo.findPublicPhotos = async (userId, limit, offset) => {
    const photos = await sequelize.query(
      `select
            user.name,
            user.image,
            photo.id,
            photo.user_id,
            photo.description,
            photo.photo_url,
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
        inner join
            users user
            on photo.user_id = user.id
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
        limit :offset, :limit`,
      {
        replacements: { user_id: userId, limit, offset },
        type: QueryTypes.SELECT
      }
    );
    return photos;
  };

  Photo.findFavoritePhotos = async (userId, limit, offset) => {
    const photos = await sequelize.query(
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
      having isLiked = 1
      limit :offset, :limit`,
      {
        replacements: { user_id: userId, limit, offset },
        type: QueryTypes.SELECT
      }
    );
    return photos;
  };

  return Photo;
};
