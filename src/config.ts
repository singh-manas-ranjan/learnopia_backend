const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export {
  PORT,
  MONGODB_URI,
  DB_NAME,
  CORS_ORIGIN,
  BCRYPT_SALT,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
