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
  if (!filePath) {
    console.warn("No file path provided");
    return null;
  }

  try {
    // Verify file exists before upload
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "profile",
    });

    // Double-check file still exists before deletion
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Successfully deleted:", filePath);
    } else {
      console.warn("File already missing:", filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Attempt cleanup even if upload failed
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Cleaned up file after error:", filePath);
      }
    } catch (unlinkError) {
      console.error("Failed to delete file:", unlinkError);
    }

    return null;
  }
};

const uploadProductOnCloudinary = async (filePath: string) => {
  if (!filePath) {
    console.warn("No file path provided");
    return null;
  }

  try {
    // Verify file exists before upload
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "product",
    });

    // Double-check file still exists before deletion
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Successfully deleted:", filePath);
    } else {
      console.warn("File already missing:", filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Attempt cleanup even if upload failed
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Cleaned up file after error:", filePath);
      }
    } catch (unlinkError) {
      console.error("Failed to delete file:", unlinkError);
    }

    return null;
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

export { uploadOnCloudinary, deleteFromCloudinary, uploadProductOnCloudinary };
