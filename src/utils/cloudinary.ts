import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
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

export async function uploadOnCloudinary(
  buffer: Buffer
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Error uploading file:", error);
          return reject(error);
        }
        resolve(result?.url ?? null);
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
}
