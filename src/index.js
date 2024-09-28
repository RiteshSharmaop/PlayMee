import dotenv from "dotenv";
import connectDB from "./db/index.js";



// import dot env, config it and modefiy dev script
dotenv.config({
    path: "./.env",
});

connectDB();
  







/*


( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME} ` )
        //  db is connected but express not able to connect thata why we did (listen --> error)
        app.on("error" , () => {
            console.log("ERRR " , error);
            throw error;
        })

        app.listen(process.env.PORT, ()=> {
            console.log(`App is listening to PORT ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("error: " , error );
        throw error;
    }
})

*/
