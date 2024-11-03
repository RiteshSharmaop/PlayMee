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
    try {
        const result = await cloudinary.uploader.destroy(livePath);
        console.log('Image deleted:', result);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

export {
    uploadOnCloudinary,
    deleteFileFromCloudinary
};
