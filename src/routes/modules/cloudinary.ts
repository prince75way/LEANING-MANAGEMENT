// cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

export const uploadVideoToCloudinary = async (video: Express.Multer.File) => {
  try {
    const result = await cloudinary.uploader.upload(video.path, {
      resource_type: 'video',
      public_id: `lms-videos/${video.filename}`,
    });

    return result.secure_url; // Returns the URL of the uploaded video
  } catch (error) {
    throw new Error('Error uploading video to Cloudinary');
  }
};
