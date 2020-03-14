exports.myPhotosQuery =
  'select  \n' +
  'photo.id, \n' +
  'photo.user_id, \n' +
  'photo.photo_url, \n' +
  'photo.description, \n' +
  'case \n' +
  '    when counter.likeCount is Null \n' +
  'then 0 \n' +
  'else \n' +
  '    counter.likeCount \n' +
  'end likeCount, \n' +
  'case \n' +
  '    when photo.id in (select photo_id from likes where user_id = :user_id)\n' +
  '        then true \n' +
  '    else \n' +
  '        false \n' +
  'end as isLiked \n' +
  'from \n' +
  'photos photo \n' +
  'left join \n' +
  '(select \n' +
  '    photo_id, \n' +
  '    count(user_id) likeCount \n' +
  'from \n' +
  '    likes \n' +
  'group by \n' +
  '    photo_id \n' +
  ') counter \n' +
  'on photo.id = counter.photo_id \n' +
  'where photo.user_id = :user_id';
