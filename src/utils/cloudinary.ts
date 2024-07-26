import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath: string
): Promise<string | null> => {
  try {
    if (!localFilePath) return null;

    const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
      }
    );
    fs.unlinkSync(localFilePath);
    return uploadResult.url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Error uploading file:", error);
    return null;
  }
};

export { uploadOnCloudinary };
