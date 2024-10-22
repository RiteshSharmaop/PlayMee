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
        console.log("File is Uploaded Successfully from Cloudinary : ");
        console.log(response);
        console.log(response.url);
        return response;
    }catch(error) {
        // remove the loaally saved temporary file as upload operation got failed
        fs.unlinkSync(localFilePath);
        return null;
    }

}
return {uploadOnCloudinary};
