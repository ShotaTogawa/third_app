'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'Follow',
    {
      followee_id: DataTypes.INTEGER,
      follower_id: DataTypes.INTEGER
    },
    {}
  );
  Follow.associate = function(models) {
    // associations can be defined here
  };
  return Follow;
};
