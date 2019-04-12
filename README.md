# Sinapsis Technical Test API

This is an simple api to upload files to an s3 bucket and generate thumbs of it.

# Getting started

1. Install Dependecies

```sh
 npm install -g serverless && npm install
```

2.  Create an environment config file.
    One level folder outside create a new config folder and inside create form example config.dev.json.

    Then Put the required keys:
    BUCKET: 'your bucket name'

3.  Set your sls credencials:

Go to ~/.aws/credentials and set a new profile

[devSinapsisProfile]
aws_access_key_id=***************
aws_secret_access_key=***************

4.  Launch development server

```sh
npm sls offline
```

# Deploy To S3 Bucket

```sh
 sls deploy -v
```
