import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


// import dot env, config it and modefiy dev script
dotenv.config({
    path: "./.env",
});

connectDB().then(()=>{
    //  db is connected but express not able to connect thata why we did (listen --> error)
    app.on("errror", (error) => {
        console.log("ERRR error: ", error);
        throw error
    })

    // if (DB and Express) is working
    // listen to port using express
    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is listening to PORT ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Mongo DB Connection failed in index.js :  " , err );
    
});
  







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
