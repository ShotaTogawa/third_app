exports.myPhotosQuery = `
  select
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
  limit :offset, :limit`;
