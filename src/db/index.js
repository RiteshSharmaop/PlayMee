import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { app } from "../app.js";


const connectDB = async () => {
    try {
        // Connecrtion Issue --> Check this code and solve the bug
        const connectingInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        //  db is connected but express not able to connect thata why we did (listen --> error)
        app.on("errror", (error) => {
            console.log("ERRR db error: ", error);
            throw error
        })


        // to check the host
        console.log(
            `\n MongoDB connected !! DB HOST ${connectingInstance.connection.host}`
        );

        app.listen(process.env.PORT, () => {
            console.log(`App is listening to PORT ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("MONGODB connection Failed ", error);
        // different os process and code in nopdjs
        process.exit(1);
    }
};

export default connectDB;
