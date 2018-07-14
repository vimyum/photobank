const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const archiver = require('archiver');

const admin = require('firebase-admin');
admin.initializeApp();

exports.generateThumbnail = functions.storage.object().onFinalize((object) => {
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.');
    return null;
  }

  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const metadata = {
    contentType: contentType,
  };
  return bucket.file(filePath).download({
    destination: tempFilePath,
  }).then(() => {
    console.log('Image downloaded locally to', tempFilePath);
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
  }).then(() => {
    console.log('Thumbnail created at', tempFilePath);
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `thumb_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Uploading the thumbnail.
    return bucket.upload(tempFilePath, {
      destination: thumbFilePath,
      metadata: metadata,
    });
    // Once the thumbnail has been uploaded delete the local file to free up disk space.
  }).then(() => {
      fs.unlinkSync(tempFilePath);
      const thumbFileName = `thumb_${fileName}`;
      const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
      const baseName = fileName.replace(/\..+$/, '');
      admin.database().ref(`/images/${baseName}`).set({
          path: filePath,
          thumbPath: thumbFilePath,
          star: 0,
          download: 0
      }).then((snapshot) => {
          return res.redirect(303, snapshot.ref.toString());
      });
  });
});

exports.bulkDownload = functions.https.onCall((data, context) => {
  const outputPath = path.join(os.tmpdir(), 'output.zip');
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip');
  const fileNames = ['thumb_IMG_8877.jpg', 'thumb_IMG_8899.jpg', 'thumb_IMG_9061.jpg'];
  const tempFilePaths = fileNames.map(fname => path.join(os.tmpdir(), fname));

  const bucket = gcs.bucket('taiyo-c3f03.appspot.com');
  const files = fileNames.map(fname => bucket.file(fname));

  return Promise.all(files.map((file, idx) => file.download({destination: tempFilePaths[idx]})))
  .then(result => {
    console.info('Image downloaded locally to %o', result);

    archive.pipe(output);
    tempFilePaths.forEach((tempFilePath, idx) => {
      archive.file(tempFilePath, {name: fileNames[idx]});
    })

    return new Promise(resolve => {

      output.on('finish', function() {
        console.info('output.finish is called.');
        resolve(bucket.upload(outputPath, {
          destination: `output_${new Date().getTime()}.zip`,
          metadata: {
            contentType: 'application/zip',
          },
        }));
      });
      console.info('call archive.finalize() 2');
      archive.finalize();
    });
  }).then(() => {
    tempFilePaths.forEach(tempFilePath => fs.unlinkSync(tempFilePath));
    fs.unlinkSync(outputPath);
    return {
      message: tempFilePaths,
    }
  })
  .catch(error => {
      console.error(`error is occured in function. ${error.message}.`);
    return {
      message: `error is occured in function. ${error.message}.`,
    }
  });
});