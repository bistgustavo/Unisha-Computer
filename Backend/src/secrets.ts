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

// Email configuration
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const companyEmail = process.env.COMPANY_EMAIL;
const companyName = process.env.COMPANY_NAME;

// Esewa Secret Key
const esewaSecret = process.env.ESEWA_SECRET;

export {
  PORT,
  CORS_ORIGIN,
  cloudName,
  cloudApiKey,
  cloudSecret,
  jwtSecret,
  jwtExpiryIn,
  emailHost,
  emailPort,
  emailUser,
  emailPassword,
  companyEmail,
  companyName,
  esewaSecret,
};
