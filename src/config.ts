const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

export { PORT, MONGODB_URI, DB_NAME, CORS_ORIGIN, BCRYPT_SALT };
