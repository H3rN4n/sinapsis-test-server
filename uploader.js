const AWS = require("aws-sdk");
//*/ get reference to S3 client
var s3 = new AWS.S3({ signatureVersion: "v4" });
module.exports.uploader = (event, context, callback) => {
  const base64Image = JSON.parse(event.body).avatar_image;

  console.log(base64Image);
  let decodedImage = new Buffer(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  //decodedImage.byteLength

  var filePath = "avatars/" + event.queryStringParameters.username + ".jpg";

  var params = {
    Body: decodedImage,
    ContentEncoding: "base64",
    ContentType: "image/jpg",
    Bucket: "s3-file-upload-dev-serverlessdeploymentbucket-btt7iylqaxbg",
    Key: filePath
  };

  console.log(decodedImage);

  return s3.upload(params, (err, data) => {
    if (err) {
      console.log("err", err);
      callback(err, null);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: err,
          input: event
        })
      };
    } else {
      let response = {
        statusCode: 200,
        headers: {
          my_header: "my_value"
        },
        body: JSON.stringify(data),
        isBase64Encoded: false
      };
      console.log("response", response);
      callback(null, response);
      return response;
    }
  });
};

module.exports.getFile = (event, context, callback) => {
  var params = {
    Bucket: "s3-file-upload-dev-serverlessdeploymentbucket-btt7iylqaxbg",
    Key: event.queryStringParameters.key
  };
  s3.getObject(params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      let response = {
        statusCode: 200,
        headers: {
          my_header: "my_value"
        },
        body: JSON.stringify(data),
        isBase64Encoded: false
      };
      callback(null, response);
    }
  });
};
