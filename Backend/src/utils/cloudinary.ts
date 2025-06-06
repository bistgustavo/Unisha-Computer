import { v2 as cloudinary } from "cloudinary";
import { cloudName, cloudApiKey, cloudSecret } from "../secrets";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudSecret,
});

const uploadOnCloudinary = async (filePath: string) => {
  try {
    if (!filePath) return null;
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "profile", // Specify the folder name in Cloudinary
    });

    fs.unlinkSync(filePath); // Delete the file from local storage after uploading

    return result.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    fs.unlinkSync(filePath); // Delete the file from local storage in case of error
    return null; // Return null if there was an error
  }
};

// Function to delete an image from Cloudinary

const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });

    console.log("Image deleted from Cloudinary:", result);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
