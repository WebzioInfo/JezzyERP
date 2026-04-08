import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 string or file buffer to Cloudinary
 * @param fileData Base64 string or file path
 * @param folder Cloudinary folder name (e.g. 'ewaybills')
 * @returns Upload result with secure_url
 */
export async function uploadToCloudinary(fileData: string, folder: string = 'ewaybills') {
  try {
    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

export default cloudinary;
