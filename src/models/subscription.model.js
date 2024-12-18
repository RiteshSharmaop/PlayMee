import mongoose , { Schema } from "mongoose";

// schema creation
const subscriptionSchema = new Schema({
    subscriber: {
        // one who is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel:{
        // one to whom 'subscriber' is subscribing
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps:true
});



// model creation
export const Subscription = mongoose.model("Subscription" , subscriptionSchema);


