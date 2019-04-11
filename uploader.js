const AWS = require("aws-sdk");
const sharp = require("sharp");
const s3 = new AWS.S3({ signatureVersion: "v4" });
const btoa = require("btoa");
const s3BucketName =
  "s3-file-upload-dev-serverlessdeploymentbucket-btt7iylqaxbg"; //s3-file-upload-dev-serverlessdeploymentbucket-btt7iylqaxbg
let bucketParams = { Bucket: s3BucketName, ACL: "public-read" };

s3.createBucket(bucketParams)
  .promise()
  .then(console.log)
  .catch(console.error);

const thumbsSizes = [
  { w: 400, h: 300 },
  { w: 160, h: 120 },
  { w: 120, h: 120 }
];

const resize = async (file, width, height) => {
  let resized = await sharp(file)
    .resize(width, height)
    .toBuffer();
  return resized;
};

const createThumbs = async (image, title, thumbsSizes) => {
  let files = await Promise.all(
    thumbsSizes.map(async size => {
      const resizedImage = await resize(image, size.w, size.h);
      var params = {
        Body: resizedImage,
        ContentEncoding: "base64",
        ContentType: "image/jpg",
        ACL: "public-read",
        Bucket: s3BucketName,
        Key: `thumbs/${title}-${size.w}x${size.h}.jpg`
      };
      let file = await s3.upload(params).promise();
      return {
        name: `${size.w}x${size.h}`,
        url: file.Location
      };
    })
  );
  return files;
};

const errorHandler = message => {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: message
    })
  };
};

module.exports.uploader = async (event, context) => {
  const req = JSON.parse(event.body);

  if (!req.image) {
    return errorHandler("image required");
  }

  if (!req.title.length) {
    return errorHandler("title required");
  }

  const base64Image = req.image;
  const title = req.title;
  let decodedImage = new Buffer(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  let response = async () => {
    let files = await createThumbs(decodedImage, title, thumbsSizes);
    return {
      statusCode: 200,
      headers: {
        my_header: "my_value"
      },
      body: JSON.stringify({
        title: req.title,
        files: files
      }),
      isBase64Encoded: false
    };
  };

  return await response();
};

const bufferToBase64 = buf => {
  var binstr = Array.prototype.map
    .call(buf, function(ch) {
      return String.fromCharCode(ch);
    })
    .join("");
  return btoa(binstr);
};
