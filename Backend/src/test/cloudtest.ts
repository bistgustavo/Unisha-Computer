import { uploadImage } from "../utils/cloudinary";

const testUpload = async () => {
  const filePath = "D:\\Required photos\\image.png"; // Replace with the path to your image
  try {
    const result = await uploadImage(filePath);
    console.log("Uploaded image details:", result);
  } catch (error) {
    console.error("Failed to upload image:", error);
  }
};

testUpload();
