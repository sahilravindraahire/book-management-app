import dotenv from "dotenv"
dotenv.config()

import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("Uploading file:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "book-manager/covers",
      resource_type: "image",
    });

    console.log("Cloudinary upload successful:", response.secure_url);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ERROR:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
    if(!publicId) return null
    try {
        const response = await cloudinary.uploader.destroy(publicId)
        return response
    } catch (error) {
        return null
    }
}