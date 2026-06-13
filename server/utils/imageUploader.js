const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').replace(/^@/, '').trim();

    if (!cloudName || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
};

const getTempPath = (file) => {
    if (!file || !file.tempFilePath) {
        throw new Error('Upload file is missing a tempFilePath. Ensure express-fileupload useTempFiles is enabled.');
    }

    return file.tempFilePath;
};

exports.uploadImageToCloud = async (file, folder, height, quality) => {
    try {
        configureCloudinary();
        const options = { folder: folder || process.env.FOLDER_NAME || 'letlearn' };
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }
        options.resource_type = "auto";
        return await cloudinary.uploader.upload(getTempPath(file), options);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.uploadFileToCloud = async (file, folder) => {
    try {
        configureCloudinary();
        const options = { folder: folder || process.env.FOLDER_NAME || 'letlearn' };
        options.resource_type = "auto";
        return await cloudinary.uploader.upload(getTempPath(file), options);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
