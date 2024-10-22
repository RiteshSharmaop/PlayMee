import multer from "multer";
// we are using disk storage to store data
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        console.log("File in multer middleware " , file);
        
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({
    storage, 
})