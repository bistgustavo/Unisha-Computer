import * as dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

//cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const cloudSecret = process.env.CLOUDINARY_API_SECRET;

//JWT details
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiryIn = process.env.JWT_EXPIRES_IN;

export {
  PORT,
  CORS_ORIGIN,
  cloudName,
  cloudApiKey,
  cloudSecret,
  jwtSecret,
  jwtExpiryIn,
};
