import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=> {
    try{
        if(!localFilePath) return null;

        // upload the file in cloudinary
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type: "auto"
        });
        // file is uploaded 
        console.log("File is Uploaded Successfully to Cloudinary : ");
        // console.log("response: " ,response);
        // console.log("Response URL : " ,response.url);
        fs.unlinkSync(localFilePath);
        return response;
    }catch(error) {
        // remove the loaally saved temporary file as upload operation got failed
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFileFromCloudinary = async(livePath) =>{
    // we are deleting the old image;
    // TODO: update delete from cloudinary 
    try {
        // Extract public_id from the URL
        const urlParts = livePath.split('/');
        const versionAndId = urlParts[urlParts.length - 1].split('.')[0]; // Removes file extension
        const publicId = `${urlParts[urlParts.length - 2]}/${versionAndId}`;

        // Delete the file using the public_id
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("File deleted:", result);
    } catch (error) {
        console.error("Error deleting file:", error);
    }
}

export {
    uploadOnCloudinary,
    deleteFileFromCloudinary
};
