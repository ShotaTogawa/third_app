const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'us-west-2'
});

exports.getPresignedURL = async (req, res) => {
  const key = `${req.user.id}/${uuid()}.jpeg`;

  const url = await s3.getSignedUrl('putObject', {
    Bucket: `insta-clone-pj/avatar/${req.params.type}`,
    ContentType: 'image/jpeg',
    Key: key
  });

  try {
    if (!url) {
      res.send('Failed to upload');
    }
    res.send({ key, url });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};
