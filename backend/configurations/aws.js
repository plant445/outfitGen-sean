import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3 = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'clothes-selection',
    contentType: (req, file, cb) => {
        cb(null, 'image/jpeg'); // Explicitly set to image/jpeg
      },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

export { s3, upload };



