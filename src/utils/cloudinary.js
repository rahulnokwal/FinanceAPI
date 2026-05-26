import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadProfile = async (filepath) => {
  try {
    if (!filepath) return null;
    const fileResponse = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    console.log("file uploaded successfully on cloudinary");
    console.log(filepath);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return fileResponse.url;
  } catch (error) {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    console.error("file upload failed", error);
    return null;
  }
};

export default uploadProfile;
