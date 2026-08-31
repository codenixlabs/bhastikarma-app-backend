import { v2 as cloudinary } from "cloudinary";

export const uploadFileToCloudinary = async (file, folder = "bhastikarma") => {
    try {
        const options = { folder };

        options.resource_type = "auto";

        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
